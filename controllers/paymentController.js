const User = require('../models/User');

// Nâng cấp VIP
exports.upgradeVIP = async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await User.findByIdAndUpdate(userId, { isVIP: true }, { new: true }).select('-passwordHash');
        if (!user) return res.status(404).send('Không tìm thấy user');
        res.json({ message: 'Nâng cấp VIP thành công', user });
    } catch (err) {
        res.status(500).send(err.message);
    }
};

// Nạp tiền donate
exports.donate = async (req, res) => {
    try {
        const { userId, amount } = req.body;
        if (!amount || amount <= 0) return res.status(400).send('Số tiền không hợp lệ');
        const user = await User.findByIdAndUpdate(
            userId,
            { $inc: { balance: amount } },
            { new: true }
        ).select('-passwordHash');
        if (!user) return res.status(404).send('Không tìm thấy user');
        res.json({ message: `Nạp ${amount} thành công`, balance: user.balance });
    } catch (err) {
        res.status(500).send(err.message);
    }
};
