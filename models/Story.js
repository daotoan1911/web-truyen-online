const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
  title: String,
  author: String,
  genre: String,
  description: String,
  cover: String,
  totalChapters: { type: Number, default: 0 },
  isVIP: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Story', storySchema);
