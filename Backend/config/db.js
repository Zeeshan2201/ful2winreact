const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // await mongoose.connect('mongodb://localhost:27017/gameDB');
    await mongoose.connect('mongodb+srv://paghdalparth22:vvNLtvmfp9K6Sget@cluster0.puiareb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
