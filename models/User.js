const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  email: { type: String, unique: true },
  passwordHash: String,
  isVerified: { type: Boolean, default: false },  // đã xác nhận email chưa
  otp: { type: String, default: null },            // mã OTP 6 số
  otpExpiry: { type: Date, default: null },         // hết hạn sau 10 phút
  isVIP: { type: Boolean, default: false },
  vipExpiry: { type: Date, default: null },
  balance: { type: Number, default: 0 },
  history: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Chapter' }],
  bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Story' }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
