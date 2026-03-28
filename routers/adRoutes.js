const express = require('express');
const router = express.Router();
const adController = require('../controllers/adController');

router.get('/', adController.getAds);           // public
router.get('/all', adController.getAllAds);      // admin
router.post('/', adController.upsertAd);         // admin upsert

module.exports = router;
