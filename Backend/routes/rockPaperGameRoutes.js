const express = require('express');
const router = express.Router();
const RockPaperGame = require('../models/RockPaperGame');
const User = require('../models/User');

// Create new game
router.post('/create', async (req, res) => {
  try {
    // Initialize game with three empty rounds
    const gameData = {
      ...req.body,
      rounds: [
        { roundNumber: 1, status: 'pending' },
        { roundNumber: 2, status: 'pending' },
        { roundNumber: 3, status: 'pending' }
      ],
      currentRound: 1,
      currentPlayerTurn: 'player1',
      player1Score: 0,
      player2Score: 0
    };
    
    const game = await RockPaperGame.create(gameData);
    req.io.emit('gameCreated', game);
    res.status(201).json(game);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get game by roomId
router.get('/room/:roomId', async (req, res) => {
  try {
    const game = await RockPaperGame.findOne({ roomId: req.params.roomId });
    res.status(200).json(game);
  } catch (err) {
    res.status(404).json({ error: 'Game not found' });
  }
});

// Get current player turn
router.get('/current-turn/:gameId', async (req, res) => {
  try {
    const game = await RockPaperGame.findById(req.params.gameId);
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }
    res.status(200).json({ currentPlayerTurn: game.currentPlayerTurn });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update player move for current round
router.put('/move/:gameId', async (req, res) => {
  try {
    const { playerId, move, roundNumber } = req.body;
    const game = await RockPaperGame.findById(req.params.gameId);

    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    // Check if it's the player's turn
    const isPlayer1 = game.player1.playerId === playerId;
    const isPlayer2 = game.player2.playerId === playerId;
    const currentTurn = game.currentPlayerTurn;

    if ((isPlayer1 && currentTurn !== 'player1') || (isPlayer2 && currentTurn !== 'player2')) {
      return res.status(400).json({ error: 'Not your turn' });
    }

    // Find and update round
    const round = game.rounds.find((r) => r.roundNumber === roundNumber);
    if (!round) {
      return res.status(400).json({ error: 'Invalid round' });
    }

    // Update move and turn
    if (isPlayer1) {
      round.player1Move = move;
      game.currentPlayerTurn = 'player2';
    } else {
      round.player2Move = move;
      game.currentPlayerTurn = 'player1';
    }

    await game.save();

    // Emit turn update
    req.io.to(game.roomId).emit('turnUpdated', {
      currentPlayerTurn: game.currentPlayerTurn,
      gameId: game._id,
    });

    // Evaluate round if both moves are made
    if (round.player1Move && round.player2Move) {
      // Determine round winner
      let roundWinner = null;
      let resultMessage = `Round ${round.roundNumber}: `;
      if (round.player1Move === round.player2Move) {
        roundWinner = null;
        resultMessage += 'Tie';
      } else if (
        (round.player1Move === 'rock' && round.player2Move === 'scissors') ||
        (round.player1Move === 'paper' && round.player2Move === 'rock') ||
        (round.player1Move === 'scissors' && round.player2Move === 'paper')
      ) {
        roundWinner = game.player1.playerId;
        game.player1Score += 1;
        resultMessage += 'Player 1 wins';
      } else {
        roundWinner = game.player2.playerId;
        game.player2Score += 1;
        resultMessage += 'Player 2 wins';
      }

      round.winner = roundWinner;
      round.status = 'completed';

      // Update round results
      game.roundResults = game.roundResults
        ? [...game.roundResults, resultMessage]
        : [resultMessage];

      // Check if game is over
      if (game.currentRound >= 3) {
        game.status = 'finished';
        if (game.player1Score > game.player2Score) {
          game.winner = game.player1.playerId;
        } else if (game.player2Score > game.player1Score) {
          game.winner = game.player2.playerId;
        } else {
          game.winner = null; // Tie
        }
      } else {
        game.currentRound += 1;
        const nextRound = game.rounds.find((r) => r.roundNumber === game.currentRound);
        if (nextRound) {
          nextRound.player1Move = null;
          nextRound.player2Move = null;
          nextRound.winner = null;
          nextRound.status = 'pending';
        }
        game.currentPlayerTurn = 'player1';
      }

      await game.save();

      // Emit game update
      req.io.to(game.roomId).emit('roundUpdated', {
        ...game.toObject(),
        currentPlayerTurn: game.currentPlayerTurn,
        roundNumber: game.currentRound,
        scores: {
          player1: game.player1Score,
          player2: game.player2Score,
        },
        roundResults: game.roundResults,
      });
    }

    res.status(200).json({
      message: 'Move recorded',
      game: {
        ...game.toObject(),
        currentPlayerTurn: game.currentPlayerTurn,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});


router.put('/update-winner/:roomId', async (req, res) => {
  try {
    const game = await RockPaperGame.findOne({ roomId: req.params.roomId });
    if (!game) return res.status(404).json({ message: "Game not found" });

    // Count round wins
    let player1Score = 0;
    let player2Score = 0;

    for (const round of game.rounds) {
      if (round.winner === 'player1') player1Score++;
      else if (round.winner === 'player2') player2Score++;
    }

    // Determine overall winner
    let winnerId = null;
    if (player1Score > player2Score) {
      winnerId = game.player1.playerId;
    } else if (player2Score > player1Score) {
      winnerId = game.player2.playerId;
    }

    // Update game
    game.player1Score = player1Score;
    game.player2Score = player2Score;
    game.winner = winnerId;
    game.status = 'finished';
    await game.save();

    // Award prize
    if (winnerId) {
      const prizeAmount = game.gamePrice * 2;
      const winnerUser = await User.findById(winnerId);
      if (winnerUser) {
        winnerUser.Balance = (winnerUser.Balance || 0) + prizeAmount;
        await winnerUser.save();
      }
    }

    res.json({
      message: winnerId ? "Winner updated and prize added." : "Game was a draw.",
      winnerId,
      player1Score,
      player2Score
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
// Helper function to determine round winner
function determineRoundWinner(move1, move2) {
  if (move1 === move2) return null;
  
  const winningMoves = {
    rock: 'scissors',
    paper: 'rock',
    scissors: 'paper'
  };

  return winningMoves[move1] === move2 ? 'player1' : 'player2';
}

module.exports = router;