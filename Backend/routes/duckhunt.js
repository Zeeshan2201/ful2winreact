const express = require('express');
const router = express.Router();
const DuckHuntGame = require('../models/DuckHuntGame');
const mongoose = require('mongoose');

// Create or get a game by room ID
router.get('/room/:roomId', async (req, res) => {
  try {
    let game = await DuckHuntGame.findOne({ roomId: req.params.roomId });

    if (!game) {
      game = await DuckHuntGame.create({
        roomId: req.params.roomId,
        status: 'waiting'
      });
      req.io?.emit('gameCreated', game);
    }

    res.status(200).json(game);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Assign players to the game
router.put('/assignPlayers/:gameId', async (req, res) => {
  try {
    const { players } = req.body;

    const game = await DuckHuntGame.findById(req.params.gameId);
    if (!game) return res.status(404).json({ error: 'Game not found' });

    game.players = players;
    game.status = 'ongoing';
    game.startTime = new Date();

    await game.save();
    req.io?.emit('playersAssigned', game);
    res.status(200).json(game);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Spawn a duck
router.post('/spawnDuck/:gameId', async (req, res) => {
  try {
    const { duckId, position } = req.body;
    const game = await DuckHuntGame.findById(req.params.gameId);
    if (!game) return res.status(404).json({ error: 'Game not found' });

    game.ducks.push({
      duckId,
      position,
    });

    await game.save();
    req.io?.emit('duckSpawned', { duckId, position });
    res.status(200).json(game);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Player fires a shot
router.put('/shoot/:gameId', async (req, res) => {
  try {
    const { playerId, x, y } = req.body;
    const game = await DuckHuntGame.findById(req.params.gameId);
    if (!game) return res.status(404).json({ error: 'Game not found' });

    // Dummy duck hit check (you can enhance this)
    const hitDuck = game.ducks.find(duck => !duck.isHit &&
      Math.abs(duck.position.x - x) < 20 &&
      Math.abs(duck.position.y - y) < 20);

    let hit = false;
    if (hitDuck) {
      hit = true;
      hitDuck.isHit = true;

      // Increase player score
      const player = game.players.find(p => p.playerId === playerId);
      if (player) player.score += 1;
    }

    // Record the shot
    const player = game.players.find(p => p.playerId === playerId);
    if (player) {
      player.shots.push({ x, y, hit });
    }

    await game.save();
    req.io?.emit('shotFired', { playerId, x, y, hit });
    res.status(200).json({ hit });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// End game manually
router.put('/end/:gameId', async (req, res) => {
  try {
    const game = await DuckHuntGame.findById(req.params.gameId);
    if (!game) return res.status(404).json({ error: 'Game not found' });

    game.status = 'finished';
    game.endTime = new Date();

    await game.save();
    req.io?.emit('gameEnded', game);
    res.status(200).json(game);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
