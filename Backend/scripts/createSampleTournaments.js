// Create sample tournaments for testing
const mongoose = require('mongoose');
const Tournament = require('./models/Tournament');

// Connect to MongoDB
mongoose.connect('your-mongodb-connection-string', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

async function createSampleTournaments() {
  try {
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
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error creating sample tournaments:', error);
    mongoose.connection.close();
  }
}

createSampleTournaments();
