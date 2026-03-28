const Comment = require('../models/Comment');

// Lấy comment theo chapterId (query param)
exports.getCommentsByChapter = async (req, res) => {
  try {
    const { chapterId } = req.query;
    const comments = await Comment.find({ chapterId })
      .populate('userId', 'username')
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Thêm comment mới
exports.addComment = async (req, res) => {
  try {
    const { chapterId, userId, content, rating } = req.body;
    const comment = await Comment.create({ chapterId, userId, content, rating });
    const populated = await comment.populate('userId', 'username');
    res.json(populated);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Xoá comment
exports.deleteComment = async (req, res) => {
  try {
    await Comment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Đã xoá bình luận' });
  } catch (err) {
    res.status(500).send(err.message);
  }
};
