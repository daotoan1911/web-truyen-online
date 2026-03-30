const Ad = require('../models/Ad');

exports.getAds = async (req, res) => {
    try {
        const ads = await Ad.find({ isActive: true });
        const result = {};
        ads.forEach(a => { result[a.slot] = a; });
        res.json(result);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

exports.getAllAds = async (req, res) => {
    try {
        const ads = await Ad.find();
        res.json(ads);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

exports.upsertAd = async (req, res) => {
    try {
        const { slot, label, url, imageUrl, isActive } = req.body;
        const ad = await Ad.findOneAndUpdate(
            { slot },
            { slot, label, url, imageUrl, isActive, updatedAt: new Date() },
            { upsert: true, new: true }
        );
        res.json(ad);
    } catch (err) {
        res.status(500).send(err.message);
    }
};
