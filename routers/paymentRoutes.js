const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

router.post('/vip', paymentController.upgradeVIP);
router.post('/donate', paymentController.donate);

module.exports = router;
