const Story = require('../models/Story');
const Chapter = require('../models/Chapter');

exports.getAllStories = async (req, res) => {
  try {
    const { genre, page = 1, limit = 10, all } = req.query;
    const filter = genre ? { genre } : {};

    if (all === 'true') {
      const stories = await Story.find(filter).sort({ createdAt: -1 });
      return res.json(stories);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [stories, total] = await Promise.all([
      Story.find(filter).skip(skip).limit(parseInt(limit)).sort({ createdAt: -1 }),
      Story.countDocuments(filter)
    ]);
    res.json({ stories, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.searchStories = async (req, res) => {
  try {
    const { q, page = 1, limit = 10 } = req.query;
    const filter = { title: { $regex: q, $options: 'i' } };
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [stories, total] = await Promise.all([
      Story.find(filter).skip(skip).limit(parseInt(limit)),
      Story.countDocuments(filter)
    ]);
    res.json({ stories, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.getStoryById = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) return res.status(404).send('Không tìm thấy truyện');
    res.json(story);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.createStory = async (req, res) => {
  try {
    const story = new Story(req.body);
    await story.save();
    res.json(story);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.updateStory = async (req, res) => {
  try {
    const story = await Story.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!story) return res.status(404).send('Không tìm thấy truyện');
    res.json(story);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.deleteStory = async (req, res) => {
  try {
    await Story.findByIdAndDelete(req.params.id);
    await Chapter.deleteMany({ storyId: req.params.id });
    res.json({ message: 'Đã xoá truyện và các chương liên quan' });
  } catch (err) {
    res.status(500).send(err.message);
  }
};
