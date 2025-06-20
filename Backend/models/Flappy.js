// models/Match.js
const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  id: { type: String, required: true },
  score: { type: Number, required: true }
});

const matchSchema = new mongoose.Schema({
  match_id: { type: String, required: true, unique: true },
  game: { type: String, required: true },
  entry_fee: { type: Number, required: true },
  players: [playerSchema],
  winner: { type: String, required: true },
  status: { type: String, enum: ['pending', 'completed'], required: true }
}, { timestamps: true });

module.exports = mongoose.model('Match', matchSchema);
