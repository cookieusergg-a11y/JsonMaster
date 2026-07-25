const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Порт из окружения (Railway сам подставит)
const PORT = process.env.PORT || 8080;

// Проверка жизни
app.get('/ping', (req, res) => res.send('pong'));

// Подключаем API-роуты (пути правильные)
try {
  app.use('/api/auth', require('./backend/routes/auth'));
  app.use('/api/subscription', require('./backend/routes/subscription'));
  app.use('/api/admin', require('./backend/routes/admin'));
  app.use('/api/editor', require('./backend/routes/editor'));
  console.log('✅ API routes loaded');
} catch (err) {
  console.error('❌ Error loading routes:', err.message);
}

// Раздача статики фронтенда (если собран)
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, 'frontend/dist');
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Подключение к MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://cookieusergg_db_user:Qsavs@cluster0.acok2vj.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });
