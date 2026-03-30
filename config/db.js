const mongoose = require('mongoose');

let isConnected = false;

async function connectDB() {
  if (isConnected) return;
  if (!process.env.MONGODB_URI) {
    console.error('❌ MONGODB_URI is not set in environment variables');
    return;
  }
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
    console.log('✅ Kết nối MongoDB Atlas thành công!');
  } catch (err) {
    console.error('❌ Lỗi kết nối MongoDB:', err.message);
  }
}

module.exports = connectDB;
