const express = require('express');
const router = express.Router();
const Tournament = require('../models/Tournament');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

// Get all tournaments
router.get('/', async (req, res) => {
  try {
    const { status, game } = req.query;
    let query = { isActive: true };
    
    // Get today's date range
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    
    if (status) {
      query.status = status;
      
      // Filter by today's date for upcoming and ongoing tournaments
      if (status === 'upcoming' || status === 'ongoing') {
        query.startTime = {
          $gte: startOfDay,
          $lt: endOfDay
        };
      }
      
      // For completed tournaments, show today's completed ones
      if (status === 'completed') {
        query.endTime = {
          $gte: startOfDay,
          $lt: endOfDay
        };
      }
    }
    
    if (game) {
      query.game = game;
    }

    const tournaments = await Tournament.find(query)
      .populate('registeredPlayers.userId', 'username avatar')
      .populate('leaderboard.userId', 'username avatar')
      .sort({ startTime: 1 });

    // Update tournament statuses
    for (let tournament of tournaments) {
      await tournament.updateStatus();
    }

    res.json(tournaments);
  } catch (error) {
    console.error('Error fetching tournaments:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single tournament
router.get('/:id', async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id)
      .populate('registeredPlayers.userId', 'username avatar')
      .populate('leaderboard.userId', 'username avatar');

    if (!tournament) {
      return res.status(404).json({ message: 'Tournament not found' });
    }

    // Update tournament status
    await tournament.updateStatus();

    res.json(tournament);
  } catch (error) {
    console.error('Error fetching tournament:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Register for tournament
router.post('/:id/register', authMiddleware, async (req, res) => {
  try {
    console.log('Tournament registration attempt:', {
      tournamentId: req.params.id,
      userId: req.user ? req.user.id : 'No user',
      userInfo: req.user
    });

    if (!req.user || !req.user.id) {
      console.log('No user found in request');
      return res.status(401).json({ message: 'Authentication required' });
    }

    const tournament = await Tournament.findById(req.params.id);
    
    if (!tournament) {
      console.log('Tournament not found:', req.params.id);
      return res.status(404).json({ message: 'Tournament not found' });
    }

    console.log('Tournament found:', tournament.name, 'Current players:', tournament.currentPlayers);

    // Check if tournament is full
    if (tournament.currentPlayers >= tournament.maxPlayers) {
      console.log('Tournament is full');
      return res.status(400).json({ message: 'Tournament is full' });
    }

    // Check if user is already registered
    const alreadyRegistered = tournament.registeredPlayers.some(
      player => player.userId.toString() === req.user.id
    );

    if (alreadyRegistered) {
      console.log('User already registered');
      return res.status(400).json({ message: 'Already registered for this tournament' });
    }    // Check if user has enough coins/balance
    const user = await User.findById(req.user.id);
    
    if (!user) {
      console.log('User not found in database:', req.user.id);
      return res.status(404).json({ message: 'User not found' });
    }
    
    console.log('User found:', user.fullName || user.phoneNumber || user.username || 'Unknown', 'Coins:', user.coins, 'Required:', tournament.entryFee);
    
    if (!user.coins || user.coins < tournament.entryFee) {
      console.log('Insufficient coins');
      return res.status(400).json({ message: 'Insufficient coins' });
    }

    // Deduct entry fee
    user.coins -= tournament.entryFee;
    await user.save();
    console.log('Coins deducted, new balance:', user.coins);

    // Register user
    tournament.registeredPlayers.push({
      userId: req.user.id,
      registeredAt: new Date()
    });
    
    tournament.currentPlayers += 1;
    await tournament.save();
    console.log('User registered successfully, current players:', tournament.currentPlayers);

    res.json({ 
      message: 'Successfully registered for tournament',
      tournament,
      remainingCoins: user.coins
    });
  } catch (error) {
    console.error('Error registering for tournament:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      message: 'Server error',
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Submit tournament score
router.post('/:id/score', authMiddleware, async (req, res) => {
  try {
    const { score } = req.body;
    const tournament = await Tournament.findById(req.params.id);
    
    if (!tournament) {
      return res.status(404).json({ message: 'Tournament not found' });
    }

    // Check if user is registered
    const playerRegistration = tournament.registeredPlayers.find(
      player => player.userId.toString() === req.user.id
    );

    if (!playerRegistration) {
      return res.status(400).json({ message: 'Not registered for this tournament' });
    }

    // Check if tournament is ongoing
    if (tournament.status !== 'ongoing') {
      return res.status(400).json({ message: 'Tournament is not active' });
    }

    // Update player's best score
    if (score > playerRegistration.bestScore) {
      playerRegistration.bestScore = score;
    }
    playerRegistration.totalGamesPlayed += 1;

    // Update leaderboard
    const user = await User.findById(req.user.id);
    await tournament.updateLeaderboard(req.user.id, user.username, score);

    res.json({ 
      message: 'Score submitted successfully',
      newBestScore: playerRegistration.bestScore,
      currentScore: score,
      leaderboard: tournament.leaderboard
    });
  } catch (error) {
    console.error('Error submitting tournament score:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get tournament leaderboard
router.get('/:id/leaderboard', async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id)
      .populate('leaderboard.userId', 'username avatar');

    if (!tournament) {
      return res.status(404).json({ message: 'Tournament not found' });
    }

    // Sort leaderboard by score
    const leaderboard = tournament.leaderboard
      .sort((a, b) => b.score - a.score)
      .map((entry, index) => ({
        ...entry.toObject(),
        rank: index + 1
      }));

    res.json(leaderboard);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's tournaments
router.get('/user/my-tournaments', authMiddleware, async (req, res) => {
  try {
    const tournaments = await Tournament.find({
      'registeredPlayers.userId': req.user.id,
      isActive: true
    })
    .populate('registeredPlayers.userId', 'username avatar')
    .populate('leaderboard.userId', 'username avatar')
    .sort({ startTime: 1 });

    // Update tournament statuses
    for (let tournament of tournaments) {
      await tournament.updateStatus();
    }

    res.json(tournaments);
  } catch (error) {
    console.error('Error fetching user tournaments:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create tournament (admin only)
router.post('/', authMiddleware, async (req, res) => {
  try {
    // Check if user is admin (you can implement admin check here)
    const user = await User.findById(req.user.id);
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const {
      name,
      game,
      startTime,
      endTime,
      entryFee,
      maxPlayers,
      prizeDistribution
    } = req.body;

    const tournament = new Tournament({
      name,
      game,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      entryFee,
      maxPlayers: maxPlayers || 100,
      prizeDistribution: prizeDistribution || {
        first: 50,
        second: 20,
        third: 10
      }
    });

    await tournament.save();
    res.status(201).json(tournament);
  } catch (error) {
    console.error('Error creating tournament:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Finalize tournament (admin only)
router.post('/:id/finalize', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const tournament = await Tournament.findById(req.params.id);
    if (!tournament) {
      return res.status(404).json({ message: 'Tournament not found' });
    }

    await tournament.finalizeTournament();

    // Award prizes to winners
    for (let winner of tournament.winners) {
      const winnerUser = await User.findById(winner.userId);
      if (winnerUser) {
        winnerUser.coins += winner.prizeAmount;
        await winnerUser.save();
      }
    }

    res.json({ 
      message: 'Tournament finalized successfully',
      winners: tournament.winners
    });
  } catch (error) {
    console.error('Error finalizing tournament:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DEVELOPMENT ONLY - Create sample tournaments
router.post('/dev/create-samples', async (req, res) => {
  try {
    // Only allow in development/testing
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({ message: 'Not allowed in production' });
    }

    // Clear existing tournaments
    await Tournament.deleteMany({});
    
    // Create sample FlappyBall tournaments
    const tournaments = [
      {
        name: 'FlappyBall Championship - Morning',
        game: 'flappyball',
        startTime: new Date(Date.now() + 1000 * 60 * 30), // 30 minutes from now
        endTime: new Date(Date.now() + 1000 * 60 * 60 * 2), // 2 hours from now
        entryFee: 10,
        maxPlayers: 50,
        currentPlayers: 0,
        prizeDistribution: {
          first: 50,
          second: 20,
          third: 10
        },
        status: 'upcoming',
        description: 'Morning FlappyBall tournament with amazing prizes!',
        isActive: true,
        registeredPlayers: [],
        leaderboard: []
      },
      {
        name: 'FlappyBall Championship - Afternoon',
        game: 'flappyball',
        startTime: new Date(Date.now() + 1000 * 60 * 60 * 4), // 4 hours from now
        endTime: new Date(Date.now() + 1000 * 60 * 60 * 6), // 6 hours from now
        entryFee: 15,
        maxPlayers: 100,
        currentPlayers: 0,
        prizeDistribution: {
          first: 50,
          second: 20,
          third: 10
        },
        status: 'upcoming',
        description: 'Afternoon FlappyBall tournament with bigger prizes!',
        isActive: true,
        registeredPlayers: [],
        leaderboard: []
      },
      {
        name: 'FlappyBall Championship - Evening',
        game: 'flappyball',
        startTime: new Date(Date.now() + 1000 * 60 * 60 * 8), // 8 hours from now
        endTime: new Date(Date.now() + 1000 * 60 * 60 * 10), // 10 hours from now
        entryFee: 20,
        maxPlayers: 150,
        currentPlayers: 0,
        prizeDistribution: {
          first: 50,
          second: 20,
          third: 10
        },
        status: 'upcoming',
        description: 'Evening FlappyBall tournament - the biggest event of the day!',
        isActive: true,
        registeredPlayers: [],
        leaderboard: []
      }
    ];

    const createdTournaments = await Tournament.insertMany(tournaments);
    console.log('Sample tournaments created:', createdTournaments.length);
    
    res.json({ 
      message: 'Sample tournaments created successfully',
      count: createdTournaments.length,
      tournaments: createdTournaments
    });
  } catch (error) {
    console.error('Error creating sample tournaments:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
