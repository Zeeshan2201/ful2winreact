// models/Room.js
const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
  gameId: { type: String, required: true },
  players: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      socketId: String
    }
  ],
  status: {
    type: String,
    enum: ['waiting', 'in-progress', 'finished'],
    default: 'waiting',
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Room', RoomSchema);
