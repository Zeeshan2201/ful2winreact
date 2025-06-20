const mongoose = require('mongoose');
const Tournament = require('../models/Tournament');

const connectDB = async () => {
  try {
    // Use the same connection string as the main app
    const connectionString = 'mongodb+srv://boostnowchat:boostnowchat@cluster0.rxw5wva.mongodb.net/gamedb?retryWrites=true&w=majority&appName=Cluster0';
    await mongoose.connect(connectionString);
    console.log('MongoDB connected for seeding');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const seedTournaments = async () => {
  try {
    // Clear existing tournaments
    await Tournament.deleteMany({});
    console.log('Cleared existing tournaments');

    // Get current date and time
    const now = new Date();
    
    // Create tournaments for today
    const tournaments = [
      {
        name: 'FlappyBall Championship - Morning',
        game: 'flappyball',
        startTime: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0, 0), // 12:00 PM today
        endTime: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 14, 0, 0), // 2:00 PM today
        entryFee: 2,
        maxPlayers: 100,
        currentPlayers: 0,
        prizeDistribution: {
          first: 50,
          second: 20,
          third: 10
        },
        status: 'upcoming',
        isActive: true
      },
      {
        name: 'FlappyBall Championship - Afternoon',
        game: 'flappyball',
        startTime: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 14, 0, 0), // 2:00 PM today
        endTime: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 16, 0, 0), // 4:00 PM today
        entryFee: 5,
        maxPlayers: 100,
        currentPlayers: 0,
        prizeDistribution: {
          first: 50,
          second: 20,
          third: 10
        },
        status: 'upcoming',
        isActive: true
      },
      {
        name: 'FlappyBall Championship - Evening',
        game: 'flappyball',
        startTime: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 16, 0, 0), // 4:00 PM today
        endTime: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 18, 0, 0), // 6:00 PM today
        entryFee: 10,
        maxPlayers: 100,
        currentPlayers: 0,
        prizeDistribution: {
          first: 50,
          second: 20,
          third: 10
        },
        status: 'upcoming',
        isActive: true
      }
    ];

    // Create tournaments for tomorrow
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const tomorrowTournaments = [
      {
        name: 'FlappyBall Championship - Morning',
        game: 'flappyball',
        startTime: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 12, 0, 0),
        endTime: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 14, 0, 0),
        entryFee: 2,
        maxPlayers: 100,
        currentPlayers: 0,
        prizeDistribution: {
          first: 50,
          second: 20,
          third: 10
        },
        status: 'upcoming',
        isActive: true
      },
      {
        name: 'FlappyBall Championship - Afternoon',
        game: 'flappyball',
        startTime: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 14, 0, 0),
        endTime: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 16, 0, 0),
        entryFee: 5,
        maxPlayers: 100,
        currentPlayers: 0,
        prizeDistribution: {
          first: 50,
          second: 20,
          third: 10
        },
        status: 'upcoming',
        isActive: true
      },
      {
        name: 'FlappyBall Championship - Evening',
        game: 'flappyball',
        startTime: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 16, 0, 0),
        endTime: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 18, 0, 0),
        entryFee: 10,
        maxPlayers: 100,
        currentPlayers: 0,
        prizeDistribution: {
          first: 50,
          second: 20,
          third: 10
        },
        status: 'upcoming',
        isActive: true
      }
    ];

    // Insert tournaments
    const allTournaments = [...tournaments, ...tomorrowTournaments];
    await Tournament.insertMany(allTournaments);
    
    console.log(`✅ Successfully seeded ${allTournaments.length} tournaments`);
    console.log('Tournament schedule:');
    allTournaments.forEach(tournament => {
      console.log(`- ${tournament.name}: ${tournament.startTime.toLocaleString()} (₹${tournament.entryFee} entry)`);
    });

  } catch (error) {
    console.error('Error seeding tournaments:', error);
  }
};

const runSeed = async () => {
  await connectDB();
  await seedTournaments();
  mongoose.connection.close();
  console.log('Database connection closed');
};

// Run the seeding script
runSeed();
