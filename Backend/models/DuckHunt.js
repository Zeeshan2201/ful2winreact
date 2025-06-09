const mongoose = require('mongoose');

const DuckHuntGameSchema = new mongoose.Schema({
  roomId: { type: String, required: true, unique: true },

  players: [{
    playerId: { type: String, required: true },
    name: String,
    status: {
      type: String,
      enum: ['won', 'lost', 'draw', 'pending'],
      default: 'pending'
    },
    score: { type: Number, default: 0 }
  }],

  status: {
    type: String,
    enum: ['waiting', 'completed'],
    default: 'waiting'
  },

  startTime: Date,
  endTime: Date
}, { timestamps: true });

module.exports = mongoose.model('DuckHuntGame', DuckHuntGameSchema);
