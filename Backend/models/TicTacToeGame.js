const mongoose = require('mongoose');

const MoveSchema = new mongoose.Schema({
  row: {
    type: Number,
    enum: [0, 1, 2],
    required: true
  },
  col: {
    type: Number,
    enum: [0, 1, 2],
    required: true
  },
  playerId: {
    type: String,
    required: true
  },
  symbol: {
    type: String,
    enum: ['X', 'O'],
    required: true
  },
  moveNumber: {
    type: Number,
    required: true
  }
}, { _id: false });

const RoundSchema = new mongoose.Schema({
  roundNumber: {
    type: Number,
    enum: [1, 2, 3],
    required: true
  },
  board: {
    type: [[String]],
    default: [
      [null, null, null],
      [null, null, null],
      [null, null, null]
    ]
  },
  moves: {
    type: [MoveSchema],
    default: []
  },
  winner: {
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: ['ongoing', 'finished', 'draw'],
    default: 'ongoing'
  }
}, { _id: false });

const TicTacToeGameSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true
  },
  player1: {
    playerId: String,
    name: String,
    symbol: {
      type: String,
      enum: ['X', 'O'],
      default: 'X'
    }
  },
  player2: {
    playerId: String,
    name: String,
    symbol: {
      type: String,
      enum: ['X', 'O'],
      default: 'O'
    }
  },
  rounds: {
    type: [RoundSchema],
    default: [
      { roundNumber: 1 },
      { roundNumber: 2 },
      { roundNumber: 3 }
    ]
  },
  currentRound: {
    type: Number,
    default: 1
  },
  status: {
    type: String,
    enum: ['waiting', 'ongoing', 'finished'],
    default: 'waiting'
  },
  winner: {
    type: String,
    default: null
  },
  player1Score: {
    type: Number,
    default: 0
  },
  player2Score: {
    type: Number,
    default: 0
  },
  currentTurn: {
    type: String,
    default: null
  }
}, { timestamps: true });

module.exports = mongoose.model('TicTacToeGame', TicTacToeGameSchema);
