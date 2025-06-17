// models/CoinflipGame.js
const mongoose = require("mongoose");

const CoinflipGameSchema = new mongoose.Schema({
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room",
    required: true,
  },
  gamePrice: { type: Number, required: true },
  player1: {
    playerId: { type: String, required: true },
    name: { type: String, required: true },
    choice: { type: String, enum: ['heads', 'tails', null], default: null },
    score: { type: Number, default: 0 },
    attempts: { type: Number, default: 0 }
  },
  player2: {
    playerId: { type: String, required: true },
    name: { type: String, required: true },
    choice: { type: String, enum: ['heads', 'tails', null], default: null },
    score: { type: Number, default: 0 },
    attempts: { type: Number, default: 0 }
  },
  rounds: [
    {
      roundNumber: { type: Number, required: true },
      player1Choice: { type: String, enum: ['heads', 'tails', null] },
      player2Choice: { type: String, enum: ['heads', 'tails', null] },
      coinResult: { type: String, enum: ['heads', 'tails', null] },
      winner: { 
        type: String,
        enum: ['Player 1', 'Player 2', 'Tie', 'None'],
        default: 'None'
      },
      status: { type: String, default: "pending" },
      scores: {
        player1: { type: Number, default: 0 },
        player2: { type: Number, default: 0 }
      }
    }
  ],
  currentRound: { type: Number, default: 1 },
  player1Score: { type: Number, default: 0 },
  player2Score: { type: Number, default: 0 },
  status: { type: String, default: "ongoing" },
  winner: { 
    type: String,
    enum: ['Player 1', 'Player 2', 'Tie', 'None'],
    default: 'None'
  },
  prizeAmount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("CoinflipGame", CoinflipGameSchema);