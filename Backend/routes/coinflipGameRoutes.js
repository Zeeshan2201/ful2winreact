// routes/coinflipGameRoutes.js
const express = require('express');
const router = express.Router();
const CoinflipGame = require('../models/CoinFlipGame');
const Room = require('../models/Room');

// Create or join a coinflip game
router.post('/join', async (req, res) => {
  const { userId, gameId, roomId } = req.body;
  try {
    let room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    let game = await CoinflipGame.findOne({ roomId });
    if (!game) {
      game = await CoinflipGame.create({
        roomId,
        gameId,
        players: [{ userId, socketId: req.io.id }],
      });
    } else if (game.players.length < 2) {
      game.players.push({ userId, socketId: req.io.id });
      game.status = 'in-progress';
      await game.save();
    } else {
      return res.status(400).json({ message: 'Game is full' });
    }

    req.io.to(roomId).emit('game_updated', game);
    res.status(200).json({ message: 'Joined game', game });
  } catch (error) {
    console.error('Error joining game:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Submit player choice
router.post('/choice', async (req, res) => {
  const { gameId, userId, choice } = req.body;
  try {
    const game = await CoinflipGame.findById(gameId);
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    const player = game.players.find((p) => p.userId.toString() === userId);
    if (!player) {
      return res.status(403).json({ message: 'Player not in game' });
    }

    if (player.attempts >= 3) {
      return res.status(400).json({ message: 'Max attempts reached' });
    }

    if (choice !== 'heads' && choice !== 'tails') {
      player.attempts += 1;
      await game.save();
      req.io.to(game.roomId).emit('invalid_choice', {
        userId,
        attempts: player.attempts,
        message: `Invalid choice, ${3 - player.attempts} attempts left`,
      });
      return res.status(400).json({ message: 'Invalid choice' });
    }

    player.choice = choice;
    await game.save();
    req.io.to(game.roomId).emit('choice_made', { userId, choice });
    res.status(200).json({ message: 'Choice submitted' });
  } catch (error) {
    console.error('Error submitting choice:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// End round and evaluate
router.post('/end-round', async (req, res) => {
  const { gameId } = req.body;
  try {
    const game = await CoinflipGame.findById(gameId);
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    const result = Math.random() < 0.5 ? 'heads' : 'tails';
    game.coinResult = result;

    const player1 = game.players[0];
    const player2 = game.players[1];
    let winner = 'None'; // Default to 'None' instead of null

    // Only determine winner if both players have made choices
    if (player1.choice && player2.choice) {
      if (player1.choice === result && player2.choice !== result) {
        player1.score += 1;
        winner = 'Player 1';
      } else if (player2.choice === result && player1.choice !== result) {
        player2.score += 1;
        winner = 'Player 2';
      } else if (player1.choice === result && player2.choice === result) {
        player1.score += 1;
        player2.score += 1;
        winner = 'Tie';
      }
    }

    game.roundWinner = winner;
    game.history.push({
      roundNumber: game.roundNumber,
      player1Choice: player1.choice || 'None',
      player2Choice: player2.choice || 'None',
      coinResult: result,
      winner,
      scores: { player1: player1.score, player2: player2.score },
    });

    game.roundNumber += 1;
    await game.save();

    req.io.to(game.roomId).emit('round_ended', {
      coinResult: result,
      winner,
      scores: { player1: player1.score, player2: player2.score },
      history: game.history,
    });

    // Check game end
    if (player1.score >= 3 || player2.score >= 3) {
      game.status = 'finished';
      game.winner = player1.score === player2.score ? 'Tie' : 
                   player1.score > player2.score ? 'Player 1' : 'Player 2';
      await game.save();
      req.io.to(game.roomId).emit('game_ended', {
        winner: game.winner,
        scores: { player1: player1.score, player2: player2.score },
      });
    } else {
      game.players.forEach((player) => {
        player.choice = null;
        player.attempts = 0;
      });
      await game.save();
      req.io.to(game.roomId).emit('new_round', { roundNumber: game.roundNumber });
    }

    res.status(200).json({ message: 'Round ended', game });
  } catch (error) {
    console.error('Error ending round:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;