const express = require('express');
const router = express.Router();
const chapterController = require('../controllers/chapterController');

router.get('/', chapterController.getChaptersByStory);
router.get('/:id', chapterController.getChapterById);
router.get('/:id/comments', chapterController.getCommentsByChapter);
router.post('/', chapterController.createChapter);
router.put('/:id', chapterController.updateChapter);
router.delete('/:id', chapterController.deleteChapter);

module.exports = router;
