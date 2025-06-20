const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Use the same connection string as the main app
const MONGODB_URI = 'mongodb+srv://boostnowchat:boostnowchat@cluster0.rxw5wva.mongodb.net/gamedb?retryWrites=true&w=majority&appName=Cluster0';

async function testUserCreation() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB successfully');

    // Test creating a user
    const testUser = {
      fullName: 'Test User',
      phoneNumber: '9999999999',
      password: 'testpassword123',
      coins: 100
    };

    console.log('Creating test user...');
    
    // Check if user already exists
    const existingUser = await User.findOne({ phoneNumber: testUser.phoneNumber });
    if (existingUser) {
      console.log('Test user already exists:', {
        id: existingUser._id,
        fullName: existingUser.fullName,
        phoneNumber: existingUser.phoneNumber,
        coins: existingUser.coins,
        createdAt: existingUser.createdAt
      });
    } else {
      // Hash password
      const hashedPassword = await bcrypt.hash(testUser.password, 10);
      
      const newUser = new User({
        ...testUser,
        password: hashedPassword
      });

      const savedUser = await newUser.save();
      console.log('Test user created successfully:', {
        id: savedUser._id,
        fullName: savedUser.fullName,
        phoneNumber: savedUser.phoneNumber,
        coins: savedUser.coins
      });
    }

    // Test finding all users
    console.log('\nFetching all users...');
    const allUsers = await User.find({}).select('fullName phoneNumber coins createdAt');
    console.log(`Found ${allUsers.length} users:`);
    allUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.fullName} (${user.phoneNumber}) - ${user.coins} coins - Created: ${user.createdAt}`);
    });

  } catch (error) {
    console.error('Error testing user creation:', error);
    console.error('Stack trace:', error.stack);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

// Run the test
testUserCreation();
