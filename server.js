const express = require('express');
const path = require('path');
const connectDB = require('./config/db');

const app = express();
connectDB();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public/user')));

app.use('/stories', require('./routers/storyRoutes'));
app.use('/chapters', require('./routers/chapterRoutes'));
app.use('/comments', require('./routers/commentRoutes'));
app.use('/users', require('./routers/userRoutes'));
app.use('/payment', require('./routers/paymentRoutes'));
app.use('/ads', require('./routers/adRoutes'));

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`User server chạy tại http://localhost:${PORT}`);
});
