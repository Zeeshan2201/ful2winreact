const mongoose = require('mongoose');
const User = require('../models/User');
require('../config/db')();

async function updateUserSchema() {
  try {
    // Find all users that don't have followers or following arrays
    const users = await User.find({
      $or: [
        { followers: { $exists: false } },
        { following: { $exists: false } }
      ]
    });

    console.log(`Found ${users.length} users to update`);

    // Update each user
    for (const user of users) {
      if (!user.followers) user.followers = [];
      if (!user.following) user.following = [];
      await user.save();
      console.log(`Updated user: ${user.fullName}`);
    }

    console.log('Schema update completed successfully');
  } catch (error) {
    console.error('Error updating schema:', error);
  } finally {
    // Close the database connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run the update
updateUserSchema(); 