const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  players: [String],
  moves: [String],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Game', gameSchema);
