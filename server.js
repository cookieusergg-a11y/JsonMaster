const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://cookieusergg_db_user:Qsavs@cluster0.acok2vj.mongodb.net/?retryWrites=true&w=majority';

const app = express();
app.use(cors());
app.use(express.json());

// --- API роуты ---
const authRoutes = require('./backend/routes/auth');
const subRoutes = require('./backend/routes/subscription');
const adminRoutes = require('./backend/routes/admin');
const editorRoutes = require('./backend/routes/editor');

app.use('/api/auth', authRoutes);
app.use('/api/subscription', subRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/editor', editorRoutes);

// --- Раздача статики фронтенда (после сборки) ---
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'frontend/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/dist/index.html'));
  });
}

// --- Подключение к БД ---
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('❌ MongoDB error:', err.message);
    process.exit(1);
  });