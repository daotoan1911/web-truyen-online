const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Story = require('./models/Story');
const Chapter = require('./models/Chapter');

connectDB();

async function seed() {
  // Xóa dữ liệu cũ
  await Story.deleteMany({});
  await Chapter.deleteMany({});

  // Tạo 18 truyện
  for (let i = 1; i <= 18; i++) {
    const story = await Story.create({
      title: `Truyện Demo ${i}`,
      author: `Tác giả ${i}`,
      genre: i % 2 === 0 ? 'Tiên Hiệp' : 'Ngôn Tình',
      description: `Mô tả ngắn cho truyện demo số ${i}.`,
      cover: `/images/cover${i}.jpg`,
      totalChapters: 100
    });

    // Tạo 100 chương cho mỗi truyện
    let chapters = [];
    for (let j = 1; j <= 100; j++) {
      chapters.push({
        storyId: story._id,
        number: j,
        title: `Chương ${j}`,
        content: `Nội dung chương ${j} của truyện demo ${i}.`
      });
    }
    await Chapter.insertMany(chapters);
  }

  console.log('✅ Seed dữ liệu 18 truyện × 100 chương thành công');
  process.exit();
}

seed();
