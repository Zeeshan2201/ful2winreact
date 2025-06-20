const mongoose = require('mongoose');
const Tournament = require('../models/Tournament');

const connectDB = async () => {
  try {
    const connectionString = 'mongodb+srv://boostnowchat:boostnowchat@cluster0.rxw5wva.mongodb.net/gamedb?retryWrites=true&w=majority&appName=Cluster0';
    await mongoose.connect(connectionString);
    console.log('MongoDB connected for daily tournament creation');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const createDailyTournaments = async () => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    // Check if tournaments already exist for today
    const existingTournaments = await Tournament.find({
      startTime: {
        $gte: startOfDay,
        $lt: endOfDay
      },
      game: 'flappyball'
    });

    if (existingTournaments.length >= 3) {
      console.log('Daily tournaments already exist for today');
      return;
    }

    // Create tournaments for today
    const tournaments = [
      {
        name: 'FlappyBall Championship - Morning',
        game: 'flappyball',
        startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12, 0, 0), // 12:00 PM
        endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 14, 0, 0), // 2:00 PM
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
        startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 14, 0, 0), // 2:00 PM
        endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 16, 0, 0), // 4:00 PM
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
        startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 16, 0, 0), // 4:00 PM
        endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 18, 0, 0), // 6:00 PM
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

    // Filter out tournaments that might already exist
    const tournamentsToCreate = tournaments.filter(newTournament => {
      return !existingTournaments.some(existing => 
        existing.startTime.getHours() === newTournament.startTime.getHours()
      );
    });

    if (tournamentsToCreate.length > 0) {
      await Tournament.insertMany(tournamentsToCreate);
      console.log(`✅ Created ${tournamentsToCreate.length} daily tournaments for ${today.toDateString()}`);
    } else {
      console.log('All tournaments for today already exist');
    }

  } catch (error) {
    console.error('Error creating daily tournaments:', error);
  }
};

const runDailyCreation = async () => {
  await connectDB();
  await createDailyTournaments();
  mongoose.connection.close();
  console.log('Database connection closed');
};

// Run the daily creation script
runDailyCreation();
