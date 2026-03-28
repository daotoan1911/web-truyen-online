const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  chapterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chapter' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  content: String,
  rating: Number,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Comment', commentSchema);
