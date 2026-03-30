const User = require('../models/User');

const VIP_PRICE = 50000;
const VIP_DAYS = 30;

exports.donate = async (req, res) => {
    try {
        const { userId, amount } = req.body;
        if (!amount || amount < 1000) return res.status(400).send('Số tiền tối thiểu là 1.000 VNĐ');
        const user = await User.findByIdAndUpdate(
            userId,
            { $inc: { balance: amount } },
            { new: true }
        ).select('-passwordHash');
        if (!user) return res.status(404).send('Không tìm thấy user');
        res.json({ message: `Nạp ${amount.toLocaleString('vi-VN')} VNĐ thành công`, balance: user.balance });
    } catch (err) {
        res.status(500).send(err.message);
    }
};

exports.upgradeVIP = async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await User.findById(userId);
        if (!user) return res.status(404).send('Không tìm thấy user');

        if (user.balance < VIP_PRICE) {
            return res.status(400).json({
                error: 'insufficient_balance',
                message: `Số dư không đủ. Cần ${VIP_PRICE.toLocaleString('vi-VN')} VNĐ, hiện có ${user.balance.toLocaleString('vi-VN')} VNĐ.`,
                required: VIP_PRICE,
                balance: user.balance
            });
        }

        const now = new Date();
        const base = (user.vipExpiry && user.vipExpiry > now) ? user.vipExpiry : now;
        const newExpiry = new Date(base.getTime() + VIP_DAYS * 24 * 60 * 60 * 1000);

        const updated = await User.findByIdAndUpdate(
            userId,
            {
                $inc: { balance: -VIP_PRICE },
                isVIP: true,
                vipExpiry: newExpiry
            },
            { new: true }
        ).select('-passwordHash');

        res.json({
            message: `Nâng cấp VIP thành công! Hết hạn: ${newExpiry.toLocaleDateString('vi-VN')}`,
            user: updated
        });
    } catch (err) {
        res.status(500).send(err.message);
    }
};

exports.checkVIPExpiry = async (userId) => {
    try {
        const user = await User.findById(userId).select('isVIP vipExpiry');
        if (user && user.isVIP && user.vipExpiry && user.vipExpiry < new Date()) {
            await User.findByIdAndUpdate(userId, { isVIP: false });
        }
    } catch { }
};
