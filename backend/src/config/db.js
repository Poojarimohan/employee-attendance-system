const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('⚠️ MongoDB connection error (continuing without DB):', err.message);
    // Do NOT exit the process here, so the server can still run
  }
};

module.exports = connectDB;
