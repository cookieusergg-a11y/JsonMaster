const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) {
  console.error('❌ TELEGRAM_BOT_TOKEN not set');
  process.exit(1);
}

const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const telegramId = String(chatId);

  try {
    // Используем домен твоего основного сервиса
    const apiUrl = 'https://jsonmaster.up.railway.app/api/auth/generate-code';
    const response = await axios.post(apiUrl, { telegramId }, { timeout: 10000 });
    const code = response.data.code;
    if (code) {
      bot.sendMessage(chatId, `🔑 Ваш код: ${code}\n⏳ Действителен 10 минут.`);
    } else {
      bot.sendMessage(chatId, '❌ Не удалось получить код. Попробуйте позже.');
    }
  } catch (error) {
    console.error('❌ Ошибка запроса к API:', error.message);
    let errorMsg = '❌ Не удалось получить код. Попробуйте позже.';
    if (error.response) {
      errorMsg += `\nОшибка сервера: ${error.response.status}`;
    }
    bot.sendMessage(chatId, errorMsg);
  }
});

console.log('🤖 Бот запущен');
