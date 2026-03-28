const express = require('express');
const path = require('path');
const connectDB = require('./config/db');

const app = express();
connectDB();

app.use(express.json());

// Static files
app.use(express.static(path.join(__dirname, 'public/user')));
app.use('/admin', express.static(path.join(__dirname, 'public/admin')));

// API routes
app.use('/stories', require('./routers/storyRoutes'));
app.use('/chapters', require('./routers/chapterRoutes'));
app.use('/comments', require('./routers/commentRoutes'));
app.use('/users', require('./routers/userRoutes'));
app.use('/payment', require('./routers/paymentRoutes'));
app.use('/ads', require('./routers/adRoutes'));

// /admin -> admin.html
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/admin/admin.html'));
});

// Chỉ listen khi chạy local, không listen trên Vercel
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server chạy tại http://localhost:${PORT}`);
        console.log(`Admin tại http://localhost:${PORT}/admin`);
    });
}

module.exports = app;
