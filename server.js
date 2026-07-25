const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// === ВРЕМЕННАЯ ЗАГЛУШКА ДЛЯ АДМИН-ВХОДА (убрать после теста) ===
app.post('/api/auth/admin-login', (req, res) => {
  const { login, password } = req.body;
  // Любые логин/пароль пропускаем
  res.json({
    token: 'fake-jwt-token',
    user: {
      isAdmin: true,
      subscription: 'lifetime',
      telegramId: '8953762615',
      firstName: 'Admin'
    }
  });
});
// =============================================================

// Подключаем все роуты (если файлы существуют)
try {
  app.use('/api/auth', require('./backend/routes/auth'));
  app.use('/api/subscription', require('./backend/routes/subscription'));
  app.use('/api/admin', require('./backend/routes/admin'));
  app.use('/api/editor', require('./backend/routes/editor'));
  console.log('✅ Все роуты загружены');
} catch (err) {
  console.error('❌ Ошибка загрузки роутов:', err.message);
}

// Раздача статики (public и dist)
app.use(express.static(path.join(__dirname, 'frontend/public')));
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, 'frontend/dist');
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/public/index.html'));
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
    console.error('❌ MongoDB error:', err.message);
    process.exit(1);
  });
