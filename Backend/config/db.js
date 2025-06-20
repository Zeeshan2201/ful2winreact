const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Use MongoDB Atlas for production/deployment, local MongoDB for development
    const mongoURI = process.env.NODE_ENV === 'production' 
      ? 'mongodb+srv://boostnowchat:boostnowchat@cluster0.rxw5wva.mongodb.net/gamedb?retryWrites=true&w=majority&appName=Cluster0'
      : 'mongodb://localhost:27017/gameDB';
    
    await mongoose.connect(mongoURI);
    console.log(`MongoDB connected: ${process.env.NODE_ENV === 'production' ? 'Cloud Atlas' : 'Local'}`);
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
