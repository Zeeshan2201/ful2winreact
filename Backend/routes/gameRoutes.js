const express = require('express');
const router = express.Router();
const Game = require('../models/Game');

router.get('/', async (req, res) => {
  const games = await Game.find();
  res.json(games);
});

router.post('/', async (req, res) => {
  const game = new Game(req.body);
  await game.save();
  res.status(201).json(game);
});

module.exports = router;
