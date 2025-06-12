// models/DiceGame.js
const mongoose = require("mongoose");

const DiceGameSchema = new mongoose.Schema({
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room",
    required: true,
   
    
  },
  gamePrice: { type: Number, required: true },
  player1: {
    playerId: { type: String, required: true },
    name: { type: String, required: true },
  },
  player2: {
    playerId: { type: String, required: true },
    name: { type: String, required: true },
  },
  rounds: [
    {
      roundNumber: { type: Number, required: true },
      player1Roll: { type: Number },
      player2Roll: { type: Number },
      winner: { type: String },
      status: { type: String, default: "pending" },
      showingPoints: { type: Boolean, default: false } // Add this field
    },
  ],
  currentRound: { type: Number, default: 1 },
  player1Score: { type: Number, default: 0 },
  player2Score: { type: Number, default: 0 },
  status: { type: String, default: "ongoing" },
  winner: { type: String },
});

module.exports = mongoose.model("DiceGame", DiceGameSchema);