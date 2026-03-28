const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');

router.get('/', commentController.getCommentsByChapter);
router.post('/', commentController.addComment);
router.delete('/:id', commentController.deleteComment);

module.exports = router;
