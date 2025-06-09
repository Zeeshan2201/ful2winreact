const express = require('express');
const router = express.Router();
const TicTacToeGame = require('../models/TicTacToeGame');
const mongoose = require('mongoose');

// Create new game
router.post('/create', async (req, res) => {
  try {
    const gameData = {
      ...req.body,
      status: 'waiting',
      currentRound: 1,
      player1Score: 0,
      player2Score: 0
    };

    const game = await TicTacToeGame.create(gameData);
    req.io?.emit('gameCreated', game);
    res.status(201).json(game);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get game by roomId
// router.get('/room/:roomId', async (req, res) => {
//   try {
//     const game = await TicTacToeGame.findOne({ roomId: req.params.roomId });
//     if (!game) return res.status(404).json({ error: 'Game not found' });
//     res.status(200).json(game);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });
// Get game by roomId or create if not found
router.get('/room/:roomId', async (req, res) => {
  try {
    let game = await TicTacToeGame.findOne({ roomId: req.params.roomId });
    
    if (!game) {
      game = await TicTacToeGame.create({
        roomId: req.params.roomId,
        status: 'waiting'
      });
      req.io?.emit('gameCreated', game);
    }

    res.status(200).json(game);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Player makes a move
router.put('/move/:gameId', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.gameId)) {
      return res.status(400).json({ error: 'Invalid game ID' });
    }

    const { row, col, playerId, symbol, moveNumber, roundNumber } = req.body;
    const game = await TicTacToeGame.findById(req.params.gameId);

    if (!game) return res.status(404).json({ error: 'Game not found' });
    if (game.status === 'finished') return res.status(400).json({ error: 'Game is already finished' });
    if (game.currentTurn !== playerId) return res.status(400).json({ error: 'Not your turn' });

    const currentRound = game.rounds.find(r => r.roundNumber === game.currentRound);
    if (!currentRound || currentRound.status === 'finished') {
      return res.status(400).json({ error: 'Invalid or finished round' });
    }

    // Check if cell is already occupied
    if (currentRound.board[row][col]) {
      return res.status(400).json({ error: 'Cell already occupied' });
    }

    // Update board and moves
    currentRound.board[row][col] = symbol;
    currentRound.moves.push({ row, col, playerId, symbol, moveNumber });

    // Check for win or draw
    const result = checkWinOrDraw(currentRound.board, symbol);
    if (result === 'win') {
      currentRound.winner = playerId;
      currentRound.status = 'finished';

      // Update score
      if (playerId === game.player1.playerId) game.player1Score += 1;
      else if (playerId === game.player2.playerId) game.player2Score += 1;

    } else if (result === 'draw') {
      currentRound.status = 'draw';
    }

    // Update current turn
    game.currentTurn = playerId === game.player1.playerId ? game.player2.playerId : game.player1.playerId;

    // If round finished and last round, end game
    if (['finished', 'draw'].includes(currentRound.status)) {
      if (game.currentRound === 3) {
        game.status = 'finished';
        if (game.player1Score > game.player2Score) {
          game.winner = game.player1.playerId;
        } else if (game.player2Score > game.player1Score) {
          game.winner = game.player2.playerId;
        }
      } else {
        game.currentRound += 1;
        // Reset current turn for new round
        game.currentTurn = game.player1.playerId;
      }
    }

    await game.save();
    req.io?.emit('moveMade', game);
    res.status(200).json(game);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Assign players to game
router.put('/assignPlayers/:gameId', async (req, res) => {
  try {
    const { gameId } = req.params;
    const { player1, player2 } = req.body;

    if (!mongoose.Types.ObjectId.isValid(gameId)) {
      return res.status(400).json({ error: 'Invalid game ID' });
    }

    const game = await TicTacToeGame.findById(gameId);
    if (!game) return res.status(404).json({ error: 'Game not found' });

    if (!game.player1.playerId) game.player1 = player1;
    if (!game.player2.playerId) game.player2 = player2;

    // If both players are assigned, start the game
    if (game.player1.playerId && game.player2.playerId) {
      game.status = 'ongoing';
      game.currentTurn = game.player1.playerId; // Player 1 starts
    }

    await game.save();
    req.io?.emit('playersAssigned', game);
    res.status(200).json(game);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Helper: Check win or draw
function checkWinOrDraw(board, symbol) {
  // Rows, columns, diagonals
  for (let i = 0; i < 3; i++) {
    if (board[i][0] === symbol && board[i][1] === symbol && board[i][2] === symbol) return 'win';
    if (board[0][i] === symbol && board[1][i] === symbol && board[2][i] === symbol) return 'win';
  }
  if (board[0][0] === symbol && board[1][1] === symbol && board[2][2] === symbol) return 'win';
  if (board[0][2] === symbol && board[1][1] === symbol && board[2][0] === symbol) return 'win';

  // Check draw
  const allFilled = board.flat().every(cell => cell !== null);
  return allFilled ? 'draw' : 'continue';
}

module.exports = router;
