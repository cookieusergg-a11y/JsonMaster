const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

// Токен бота (бери из .env или вставь напрямую)
const token = process.env.TELEGRAM_BOT_TOKEN || '8948037479:AAETZBNfnR6OG_XpN2hIAcF8SljI2JxLGfQ';

// Создаём бота с polling (для простоты)
const bot = new TelegramBot(token, { polling: true });

// Обработчик команды /start
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const telegramId = String(chatId);

  try {
    // Отправляем POST-запрос на твой сервер (замени URL на свой, если надо)
    const response = await axios.post('https://jsonmaster.onrender.com/api/auth/generate-code', { telegramId });
    const code = response.data.code;

    // Отправляем код пользователю
    bot.sendMessage(chatId, `Ваш код для входа: ${code}\nДействителен 10 минут.`);
  } catch (error) {
    console.error('Ошибка генерации кода:', error.message);
    bot.sendMessage(chatId, '❌ Не удалось сгенерировать код. Попробуйте позже.');
  }
});

// Логируем запуск
console.log('🤖 Бот запущен и слушает команды...');