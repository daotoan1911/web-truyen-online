const express = require('express');
const path = require('path');
const connectDB = require('./config/db');

const app = express();
connectDB();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public/admin')));

app.use('/stories', require('./routers/storyRoutes'));
app.use('/chapters', require('./routers/chapterRoutes'));
app.use('/comments', require('./routers/commentRoutes'));
app.use('/users', require('./routers/userRoutes'));
app.use('/ads', require('./routers/adRoutes'));

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Admin server chạy tại http://localhost:${PORT}/admin.html`);
});
