const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Code = require('../models/Code');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// --- генерация кода для бота ---
router.post('/generate-code', async (req, res) => {
  const { telegramId } = req.body;
  if (!telegramId) return res.status(400).json({ error: 'telegramId required' });

  await Code.findOneAndDelete({ telegramId });

  const code = crypto.randomBytes(4).toString('hex');
  const newCode = new Code({ telegramId, code });
  await newCode.save();

  res.json({ code });
});

// --- регистрация по коду ---
router.post('/register-with-code', async (req, res) => {
  const { code } = req.body;
  if (!code) return res.status(400).json({ error: 'code required' });

  const codeDoc = await Code.findOne({ code });
  if (!codeDoc) return res.status(404).json({ error: 'Invalid or expired code' });

  const telegramId = codeDoc.telegramId;

  let user = await User.findOne({ telegramId });
  if (!user) {
    user = new User({
      telegramId,
      username: '',
      firstName: '',
      lastName: '',
      photoUrl: '',
      subscription: 'trial',
      trialStart: new Date(),
      trialEnd: new Date(+new Date() + 7*24*60*60*1000)
    });
    if (telegramId === process.env.ADMIN_TELEGRAM_ID) {
      user.isAdmin = true;
      user.subscription = 'lifetime';
      user.premiumUntil = null;
    }
    await user.save();
  } else {
    // если уже есть, обновляем пробную подписку
    if (user.subscription === 'trial') {
      user.trialEnd = new Date(+new Date() + 7*24*60*60*1000);
      await user.save();
    }
  }

  await Code.findByIdAndDelete(codeDoc._id);

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
  res.json({ token, user: { ...user.toObject(), password: undefined } });
});

module.exports = router;
