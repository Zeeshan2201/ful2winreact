const mongoose = require('mongoose');
const User = require('../models/User');

const connectDB = async () => {
  try {
    const connectionString = 'mongodb+srv://boostnowchat:boostnowchat@cluster0.rxw5wva.mongodb.net/gamedb?retryWrites=true&w=majority&appName=Cluster0';
    await mongoose.connect(connectionString);
    console.log('MongoDB connected for user update');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const updateUsers = async () => {
  try {
    // Find users without username or coins
    const users = await User.find({
      $or: [
        { username: { $exists: false } },
        { username: null },
        { coins: { $exists: false } }
      ]
    });

    console.log(`Found ${users.length} users to update`);

    for (let user of users) {
      let updateData = {};

      // Generate username if missing
      if (!user.username) {
        const baseUsername = user.fullName.toLowerCase().replace(/\s+/g, '');
        const randomSuffix = Math.floor(Math.random() * 10000);
        updateData.username = `${baseUsername}${randomSuffix}`;
      }

      // Add coins if missing
      if (user.coins === undefined || user.coins === null) {
        updateData.coins = 100;
      }

      if (Object.keys(updateData).length > 0) {
        await User.findByIdAndUpdate(user._id, updateData);
        console.log(`Updated user ${user.fullName} with:`, updateData);
      }
    }

    console.log('✅ User update completed');
  } catch (error) {
    console.error('Error updating users:', error);
  }
};

const runUpdate = async () => {
  await connectDB();
  await updateUsers();
  mongoose.connection.close();
  console.log('Database connection closed');
};

// Run the update script
runUpdate();
