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

    // Find the current round
    const currentRound = game.rounds.find(r => r.roundNumber === roundNumber);
    if (!currentRound) {
      return res.status(400).json({ error: 'Invalid round number' });
    }

    // Update the appropriate player's move
    if (isPlayer1) {
      currentRound.player1Move = move;
      game.currentPlayerTurn = 'player2';
    } else if (isPlayer2) {
      currentRound.player2Move = move;
      game.currentPlayerTurn = 'player1';
    } else {
      return res.status(400).json({ error: 'Invalid player' });
    }

    // Check if both players have made their moves
    if (currentRound.player1Move && currentRound.player2Move) {
      // Determine round winner
      const winner = determineRoundWinner(currentRound.player1Move, currentRound.player2Move);
      currentRound.winner = winner;
      currentRound.status = 'completed';

      // Update scores
      if (winner === game.player1.playerId) {
        game.player1Score += 1;
      } else if (winner === game.player2.playerId) {
        game.player2Score += 1;
      }

      // Check if game is over
      if (roundNumber === 3) {
        game.status = 'finished';
        game.winner = game.player1Score > game.player2Score ? game.player1.playerId :
                     game.player2Score > game.player1Score ? game.player2.playerId : null;
      } else {
        game.currentRound = roundNumber + 1;
      }
    }

    await game.save();
    req.io.emit('roundUpdated', game);
    res.status(200).json(game);
  } catch (err) {
    res.status(400).json({ error: err.message });
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
