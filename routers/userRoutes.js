const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/register', userController.register);
router.post('/verify-otp', userController.verifyOTP);
router.post('/login', userController.login);
router.get('/all', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.post('/:id/admin-vip', userController.adminToggleVIP);
router.delete('/:id', userController.deleteUser);
router.post('/:id/history', userController.addHistory);
router.post('/:id/bookmark', userController.addBookmark);

module.exports = router;
