// ... остальные роуты ...

// --- Вход для администратора (логин + пароль) ---
router.post('/admin-login', async (req, res) => {
  const { login, password } = req.body;
  if (!login || !password) {
    return res.status(400).json({ error: 'Login and password required' });
  }

  // Проверяем по переменным окружения
  if (login !== process.env.ADMIN_LOGIN || password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Находим или создаём пользователя-администратора (по фиксированному Telegram ID)
  const adminTelegramId = process.env.ADMIN_TELEGRAM_ID || '8953762615';
  let user = await User.findOne({ telegramId: adminTelegramId });
  if (!user) {
    user = new User({
      telegramId: adminTelegramId,
      username: 'admin',
      firstName: 'Admin',
      lastName: '',
      photoUrl: '',
      subscription: 'lifetime',
      trialStart: new Date(),
      trialEnd: new Date(+new Date() + 365*24*60*60*1000),
      isAdmin: true,
      premiumUntil: null
    });
    await user.save();
  } else {
    // Убедимся, что у него есть права админа
    if (!user.isAdmin) {
      user.isAdmin = true;
      user.subscription = 'lifetime';
      await user.save();
    }
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
  res.json({ token, user: { ...user.toObject(), password: undefined } });
});

module.exports = router;
