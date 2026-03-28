const Chapter = require('../models/Chapter');
const Comment = require('../models/Comment');
const Story = require('../models/Story');

// Lấy tất cả chương theo storyId
exports.getChaptersByStory = async (req, res) => {
  try {
    const { storyId } = req.query;
    const chapters = await Chapter.find({ storyId }).sort({ number: 1 });
    res.json(chapters);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Lấy chương theo ID
exports.getChapterById = async (req, res) => {
  try {
    const chapter = await Chapter.findById(req.params.id);
    if (!chapter) return res.status(404).send('Không tìm thấy chương');

    // Nếu chương VIP, kiểm tra user
    if (chapter.isVIP) {
      const userId = req.headers['x-user-id'];
      let isVIP = false;
      if (userId) {
        const User = require('../models/User');
        const user = await User.findById(userId).select('isVIP');
        isVIP = user?.isVIP || false;
      }
      if (!isVIP) {
        // Trả về preview 200 ký tự đầu
        return res.json({
          ...chapter.toObject(),
          content: chapter.content.slice(0, 200) + '...',
          isLocked: true
        });
      }
    }

    res.json(chapter);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Thêm chương mới
exports.createChapter = async (req, res) => {
  try {
    const chapter = new Chapter(req.body);
    await chapter.save();
    // Cập nhật totalChapters của story
    const count = await Chapter.countDocuments({ storyId: chapter.storyId });
    await Story.findByIdAndUpdate(chapter.storyId, { totalChapters: count });
    res.json(chapter);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Cập nhật chương
exports.updateChapter = async (req, res) => {
  try {
    const chapter = await Chapter.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!chapter) return res.status(404).send('Không tìm thấy chương');
    res.json(chapter);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Xoá chương
exports.deleteChapter = async (req, res) => {
  try {
    const chapter = await Chapter.findByIdAndDelete(req.params.id);
    if (!chapter) return res.status(404).send('Không tìm thấy chương');
    // Cập nhật totalChapters
    const count = await Chapter.countDocuments({ storyId: chapter.storyId });
    await Story.findByIdAndUpdate(chapter.storyId, { totalChapters: count });
    res.json({ message: 'Đã xoá chương' });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Lấy comments theo chapterId (route: /chapters/:id/comments)
exports.getCommentsByChapter = async (req, res) => {
  try {
    const comments = await Comment.find({ chapterId: req.params.id })
      .populate('userId', 'username')
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    res.status(500).send(err.message);
  }
};
