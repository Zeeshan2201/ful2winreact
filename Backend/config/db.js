const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Always use MongoDB Atlas (hosted database)
    const mongoURI = 'mongodb+srv://boostnowchat:boostnowchat@cluster0.rxw5wva.mongodb.net/gamedb?retryWrites=true&w=majority&appName=Cluster0';
    
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected: Cloud Atlas');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
