const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// --- API роуты ---
app.use('/api/auth', require('./backend/routes/auth'));
app.use('/api/subscription', require('./backend/routes/subscription'));
app.use('/api/admin', require('./backend/routes/admin'));
app.use('/api/editor', require('./backend/routes/editor'));

// --- Раздача статики ---
// 1. Папка public (для редактора и других статических файлов)
app.use(express.static(path.join(__dirname, 'frontend/public')));

// 2. Папка dist (собранный React-фронтенд) — если включен production-режим
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, 'frontend/dist');
  app.use(express.static(distPath));
  // Все остальные запросы отдаём index.html (для SPA)
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  // В режиме разработки можно отдать index.html из public, если нет dist
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/public/index.html'));
  });
}

// --- Подключение к MongoDB ---
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://cookieusergg_db_user:Qsavs@cluster0.acok2vj.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB error:', err.message);
    process.exit(1);
  });
