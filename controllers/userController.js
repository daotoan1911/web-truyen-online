const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Đăng ký
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).send('Email đã được sử dụng');
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, passwordHash });
    res.json({ message: 'Đăng ký thành công', user: { _id: user._id, username: user.username, email: user.email } });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Đăng nhập
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).send('User không tồn tại');
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(401).send('Sai mật khẩu');
    res.json({ message: 'Đăng nhập thành công', user: { _id: user._id, username: user.username, email: user.email, isVIP: user.isVIP } });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Lấy thông tin user theo ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-passwordHash');
    if (!user) return res.status(404).send('Không tìm thấy user');
    res.json(user);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Lưu lịch sử đọc
exports.addHistory = async (req, res) => {
  try {
    const { chapterId } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { history: chapterId } },
      { new: true }
    ).select('-passwordHash');
    res.json(user);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Bookmark truyện
exports.addBookmark = async (req, res) => {
  try {
    const { storyId } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { bookmarks: storyId } },
      { new: true }
    ).select('-passwordHash');
    res.json(user);
  } catch (err) {
    res.status(500).send(err.message);
  }
};
