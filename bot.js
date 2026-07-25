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
    const response = await axios.post('https://jsonmaster-production.up.railway.app/api/auth/generate-code', { telegramId });
    const code = response.data.code;
    bot.sendMessage(chatId, `🔑 Ваш код: ${code}\n⏳ Действителен 10 минут.`);
  } catch (error) {
    console.error('❌ Ошибка запроса к API:', error.message);
    bot.sendMessage(chatId, '❌ Не удалось получить код. Попробуйте позже.');
  }
});

console.log('🤖 Бот запущен');
