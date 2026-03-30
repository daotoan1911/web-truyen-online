const User = require('../models/User');
const bcrypt = require('bcryptjs');

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!isValidEmail(email)) return res.status(400).send('Email không hợp lệ');
    if (!password || password.length < 6) return res.status(400).send('Mật khẩu tối thiểu 6 ký tự');
    if (!username || !username.trim()) return res.status(400).send('Vui lòng nhập tên hiển thị');

    const existing = await User.findOne({ email });
    if (existing && existing.isVerified) return res.status(400).send('Email đã được sử dụng');

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    const passwordHash = await bcrypt.hash(password, 10);

    if (existing && !existing.isVerified) {
      existing.username = username;
      existing.passwordHash = passwordHash;
      existing.otp = otp;
      existing.otpExpiry = otpExpiry;
      await existing.save();
    } else {
      await User.create({ username, email, passwordHash, otp, otpExpiry, isVerified: false });
    }

    const { sendOTP } = require('../config/mailer');
    await sendOTP(email, otp);
    res.json({ message: 'OTP đã gửi về email. Vui lòng kiểm tra hộp thư.', email });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).send('Không tìm thấy tài khoản');
    if (user.isVerified) return res.status(400).send('Tài khoản đã được xác nhận');
    if (!user.otp || user.otp !== otp) return res.status(400).send('Mã OTP không đúng');
    if (user.otpExpiry < new Date()) return res.status(400).send('Mã OTP đã hết hạn. Vui lòng đăng ký lại');

    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    res.json({ message: 'Xác nhận thành công! Bạn có thể đăng nhập.', user: { _id: user._id, username: user.username, email: user.email } });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!isValidEmail(email)) return res.status(400).send('Email không hợp lệ');
    const user = await User.findOne({ email });
    if (!user) return res.status(404).send('Email chưa được đăng ký');
    if (!user.isVerified) return res.status(403).send('Tài khoản chưa xác nhận email. Vui lòng kiểm tra hộp thư.');
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(401).send('Sai mật khẩu');
    res.json({ message: 'Đăng nhập thành công', user: { _id: user._id, username: user.username, email: user.email, isVIP: user.isVIP, balance: user.balance, vipExpiry: user.vipExpiry } });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-passwordHash -otp -otpExpiry').sort({ createdAt: -1 }).maxTimeMS(10000);
    res.json(users);
  } catch (err) {
    console.error('getAllUsers error:', err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.adminToggleVIP = async (req, res) => {
  try {
    const { action } = req.body;
    const update = action === 'grant'
      ? { isVIP: true, vipExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) }
      : { isVIP: false, vipExpiry: null };
    const user = await User.findByIdAndUpdate(req.params.id, update, { new: true }).select('-passwordHash');
    if (!user) return res.status(404).send('Không tìm thấy user');
    res.json(user);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Đã xoá tài khoản' });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.getUserById = async (req, res) => {
  try {
    let user = await User.findById(req.params.id).select('-passwordHash');
    if (!user) return res.status(404).send('Không tìm thấy user');
    if (user.isVIP && user.vipExpiry && user.vipExpiry < new Date()) {
      user = await User.findByIdAndUpdate(req.params.id, { isVIP: false }, { new: true }).select('-passwordHash');
    }
    res.json(user);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

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
