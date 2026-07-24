const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

function checkTelegramHash(data, botToken) {
  const { hash, ...rest } = data;
  const secret = crypto.createHash('sha256').update(botToken).digest();
  const checkString = Object.keys(rest).sort().map(k => `${k}=${rest[k]}`).join('\n');
  const hmac = crypto.createHmac('sha256', secret).update(checkString).digest('hex');
  return hmac === hash;
}

router.post('/telegram-login', async (req, res) => {
  const { id, first_name, last_name, username, photo_url, hash, auth_date } = req.body;
  if (!checkTelegramHash({ id, first_name, last_name, username, photo_url, auth_date, hash }, process.env.TELEGRAM_BOT_TOKEN)) {
    return res.status(401).json({ error: 'Invalid hash' });
  }
  const telegramId = String(id);
  let user = await User.findOne({ telegramId });
  if (!user) {
    user = new User({
      telegramId,
      username: username || '',
      firstName: first_name || '',
      lastName: last_name || '',
      photoUrl: photo_url || '',
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
    user.username = username || user.username;
    user.firstName = first_name || user.firstName;
    user.lastName = last_name || user.lastName;
    user.photoUrl = photo_url || user.photoUrl;
    await user.save();
  }
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
  res.json({ token, user: { ...user.toObject(), password: undefined } });
});

module.exports = router;