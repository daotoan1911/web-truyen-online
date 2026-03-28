const mongoose = require('mongoose');

async function connectDB() {
  try {
    await mongoose.connect(
  "mongodb://demo_truyen:Dt19112001@ac-ey6gf0v-shard-00-00.ne64cta.mongodb.net:27017,ac-ey6gf0v-shard-00-01.ne64cta.mongodb.net:27017,ac-ey6gf0v-shard-00-02.ne64cta.mongodb.net:27017/webtruyen?ssl=true&replicaSet=atlas-8lkiez-shard-0&authSource=admin&retryWrites=true&w=majority"
);

    console.log("✅ Kết nối MongoDB Atlas thành công!");
  } catch (err) {
    console.error("❌ Lỗi kết nối MongoDB:", err);
    process.exit(1);
  }
}

module.exports = connectDB;
