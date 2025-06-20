// routes/matchRoutes.js
const express = require('express');
const router = express.Router();
const Match = require('../models/Fluppy');

// Create a new match
router.post('/matches', async (req, res) => {
  try {
    const match = new Match(req.body);
    const savedMatch = await match.save();
    res.status(201).json(savedMatch);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all matches
router.get('/matches', async (req, res) => {
  try {
    const matches = await Match.find();
    res.json(matches);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a single match by ID
router.get('/matches/:matchId', async (req, res) => {
  try {
    const match = await Match.findOne({ match_id: req.params.matchId });
    if (!match) return res.status(404).json({ error: 'Match not found' });
    res.json(match);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
