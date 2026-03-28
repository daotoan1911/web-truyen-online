const express = require('express');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/admin.html'));
});

if (process.env.NODE_ENV !== 'production') {
    app.listen(5000, () => console.log('Admin: http://localhost:5000'));
}

module.exports = app;
