const mongoose = require('mongoose');

const RoundSchema = new mongoose.Schema({
  roundNumber: {
    type: Number,
    enum: [1, 2, 3],
    required: true
  },
  player1Move: { 
    type: String, 
    enum: ['rock', 'paper', 'scissors'],
    default: null
  },
  player2Move: { 
    type: String, 
    enum: ['rock', 'paper', 'scissors'],
    default: null
  },
  winner: { 
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: ['pending', 'completed'],
    default: 'pending'
  }
});

const RockPaperGameSchema = new mongoose.Schema({
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true,
    unique: true
  },
  gamePrice: Number,
  player1: {
    playerId: String,
    name: String
  },
  player2: {
    playerId: String,
    name: String
  },
  rounds: [RoundSchema],
  currentRound: {
    type: Number,
    default: 1
  },
  currentPlayerTurn: {
    type: String,
    enum: ['player1', 'player2'],
    default: 'player1'
  },
  status: {
    type: String,
    enum: ['ongoing', 'finished'],
    default: 'ongoing'
  },
  winner: String, // final winner's playerId
  player1Score: {
    type: Number,
    default: 0
  },
  player2Score: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('RockPaperGame', RockPaperGameSchema);
