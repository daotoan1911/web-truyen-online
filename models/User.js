const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  email: { type: String, unique: true },
  passwordHash: String,
  isVIP: { type: Boolean, default: false },
  vipExpiry: { type: Date, default: null },   // ngày hết hạn VIP
  balance: { type: Number, default: 0 },       // số dư ví (VNĐ)
  history: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Chapter' }],
  bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Story' }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
