const mongoose = require('mongoose');

const tournamentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  game: {
    type: String,
    required: true,
    enum: ['flappyball', 'duckhunt', 'tictactoe', 'coinflip', 'dice', 'rockpaper']
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  entryFee: {
    type: Number,
    required: true,
    min: 0
  },
  maxPlayers: {
    type: Number,
    required: true,
    default: 100
  },
  currentPlayers: {
    type: Number,
    default: 0
  },
  prizeDistribution: {
    first: {
      type: Number,
      default: 50 // percentage
    },
    second: {
      type: Number,
      default: 20 // percentage
    },
    third: {
      type: Number,
      default: 10 // percentage
    }
  },
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed'],
    default: 'upcoming'
  },
  registeredPlayers: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    registeredAt: {
      type: Date,
      default: Date.now
    },
    bestScore: {
      type: Number,
      default: 0
    },
    totalGamesPlayed: {
      type: Number,
      default: 0
    }
  }],
  leaderboard: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    username: String,
    score: {
      type: Number,
      required: true
    },
    rank: Number,
    achievedAt: {
      type: Date,
      default: Date.now
    }
  }],
  winners: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    username: String,
    rank: Number,
    score: Number,
    prizeAmount: Number
  }],
  totalPrizePool: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Update tournament status based on current time
tournamentSchema.methods.updateStatus = function() {
  const now = new Date();
  if (now < this.startTime) {
    this.status = 'upcoming';
  } else if (now >= this.startTime && now < this.endTime) {
    this.status = 'ongoing';
  } else {
    this.status = 'completed';
  }
  return this.save();
};

// Calculate total prize pool
tournamentSchema.methods.calculatePrizePool = function() {
  this.totalPrizePool = this.currentPlayers * this.entryFee;
  return this.totalPrizePool;
};

// Update leaderboard
tournamentSchema.methods.updateLeaderboard = function(userId, username, score) {
  // Find existing entry
  const existingEntry = this.leaderboard.find(entry => 
    entry.userId.toString() === userId.toString()
  );

  if (existingEntry) {
    // Update if new score is better
    if (score > existingEntry.score) {
      existingEntry.score = score;
      existingEntry.achievedAt = new Date();
    }
  } else {
    // Add new entry
    this.leaderboard.push({
      userId,
      username,
      score,
      achievedAt: new Date()
    });
  }

  // Sort leaderboard by score (descending) and update ranks
  this.leaderboard.sort((a, b) => b.score - a.score);
  this.leaderboard.forEach((entry, index) => {
    entry.rank = index + 1;
  });

  return this.save();
};

// Finalize tournament and determine winners
tournamentSchema.methods.finalizeTournament = function() {
  if (this.status !== 'completed') {
    return;
  }

  // Sort leaderboard by score
  this.leaderboard.sort((a, b) => b.score - a.score);

  // Calculate prize amounts
  const totalPrize = this.calculatePrizePool();
  const firstPrize = Math.floor((totalPrize * this.prizeDistribution.first) / 100);
  const secondPrize = Math.floor((totalPrize * this.prizeDistribution.second) / 100);
  const thirdPrize = Math.floor((totalPrize * this.prizeDistribution.third) / 100);

  // Set winners
  this.winners = [];
  if (this.leaderboard.length >= 1) {
    this.winners.push({
      userId: this.leaderboard[0].userId,
      username: this.leaderboard[0].username,
      rank: 1,
      score: this.leaderboard[0].score,
      prizeAmount: firstPrize
    });
  }
  if (this.leaderboard.length >= 2) {
    this.winners.push({
      userId: this.leaderboard[1].userId,
      username: this.leaderboard[1].username,
      rank: 2,
      score: this.leaderboard[1].score,
      prizeAmount: secondPrize
    });
  }
  if (this.leaderboard.length >= 3) {
    this.winners.push({
      userId: this.leaderboard[2].userId,
      username: this.leaderboard[2].username,
      rank: 3,
      score: this.leaderboard[2].score,
      prizeAmount: thirdPrize
    });
  }

  return this.save();
};

// Pre-save middleware to update status
tournamentSchema.pre('save', function(next) {
  const now = new Date();
  if (now < this.startTime) {
    this.status = 'upcoming';
  } else if (now >= this.startTime && now < this.endTime) {
    this.status = 'ongoing';
  } else {
    this.status = 'completed';
  }
  next();
});

const Tournament = mongoose.model('Tournament', tournamentSchema);

module.exports = Tournament;
