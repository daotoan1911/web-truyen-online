const express = require('express');
const path = require('path');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();
connectDB();

app.use(cors()); // cho phép admin app gọi API
app.use(express.json());

// Static user frontend
app.use(express.static(path.join(__dirname, 'public/user')));

// API routes
app.use('/stories', require('./routers/storyRoutes'));
app.use('/chapters', require('./routers/chapterRoutes'));
app.use('/comments', require('./routers/commentRoutes'));
app.use('/users', require('./routers/userRoutes'));
app.use('/payment', require('./routers/paymentRoutes'));
app.use('/ads', require('./routers/adRoutes'));

if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`User server: http://localhost:${PORT}`));
}

module.exports = app;
