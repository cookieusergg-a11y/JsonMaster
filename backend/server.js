const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const PORT = 5000;

// ТОЧНАЯ СТРОКА ИЗ ATLAS (БЕЗ +srv) — ТЫ ЕЁ СКОПИРОВАЛ, Я ВСТАВИЛ ПАРОЛЬ
const MONGO_URI =
  'mongodb://cookieusergg_db_user:Qsavs@ac-m7t3v34-shard-00-00.acok2vj.mongodb.net:27017,ac-m7t3v34-shard-00-01.acok2vj.mongodb.net:27017,ac-m7t3v34-shard-00-02.acok2vj.mongodb.net:27017/?ssl=true&replicaSet=atlas-135c95-shard-0&authSource=admin&appName=Cluster0';

// Жёстко задаём секреты (для других модулей)
process.env.JWT_SECRET = 'JsonMaster2026bot';
process.env.TELEGRAM_BOT_TOKEN = '8948037479:AAETZBNfnR6OG_XpN2hIAcF8SljI2JxLGfQ';
process.env.ADMIN_TELEGRAM_ID = '8953762615';

const app = express();
app.use(cors());
app.use(express.json());

// Подключаем роуты (убедись, что они есть)
const authRoutes = require('./routes/auth');
const subRoutes = require('./routes/subscription');
const adminRoutes = require('./routes/admin');
const editorRoutes = require('./routes/editor');

app.use('/api/auth', authRoutes);
app.use('/api/subscription', subRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/editor', editorRoutes);

// Подключаемся к MongoDB и запускаем сервер
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    console.log('\n📌 Проверь:');
    console.log('1. В Атласе пользователь cookieusergg_db_user имеет пароль Qsavs');
    console.log('2. IP 0.0.0.0/0 добавлен в Network Access (ты уже добавил)');
    console.log('3. Копия строки подключения взята из раздела "Connect your application"');
    process.exit(1);
  });