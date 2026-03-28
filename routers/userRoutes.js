const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/:id', userController.getUserById);
router.post('/:id/history', userController.addHistory);
router.post('/:id/bookmark', userController.addBookmark);

module.exports = router;
