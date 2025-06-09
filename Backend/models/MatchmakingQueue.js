// models/MatchmakingQueue.js
const mongoose = require('mongoose');

const MatchmakingQueueSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   gameId: { type: mongoose.Schema.Types.ObjectId, ref: 'Game', required: true },
  gameId: { type: String, required: true },

  socketId: { type: String, required: true },
  joinedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('MatchmakingQueue', MatchmakingQueueSchema);
