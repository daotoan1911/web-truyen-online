const mongoose = require('mongoose');

const adSchema = new mongoose.Schema({
    slot: { type: String, unique: true }, // 'banner_top', 'banner_bottom', 'sidebar', 'shopee'
    label: String,                        // tên hiển thị trong admin
    url: String,                          // link đích
    imageUrl: String,                     // ảnh banner (tuỳ chọn)
    isActive: { type: Boolean, default: true },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Ad', adSchema);
