const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Subscription = require('../models/Subscription');

router.use(auth);
router.use(async (req, res, next) => {
  if (!req.user.isAdmin) return res.status(403).json({ error: 'Admin only' });
  next();
});

router.post('/grant', async (req, res) => {
  const { telegramId, days } = req.body;
  if (!telegramId || !days || days <= 0) return res.status(400).json({ error: 'Invalid data' });
  const target = await User.findOne({ telegramId });
  if (!target) return res.status(404).json({ error: 'User not found' });
  if (target.subscription === 'lifetime') return res.json({ message: 'User already has lifetime' });
  if (target.subscription === 'trial') {
    target.subscription = 'premium';
    target.trialEnd = null;
  }
  const now = new Date();
  if (target.premiumUntil && target.premiumUntil > now) {
    target.premiumUntil = new Date(target.premiumUntil.getTime() + days * 86400000);
  } else {
    target.premiumUntil = new Date(now.getTime() + days * 86400000);
  }
  await target.save();
  const log = new Subscription({ userId: target._id, action: 'grant', days, adminId: req.user._id });
  await log.save();
  res.json({ message: `Granted ${days} days to ${telegramId}` });
});

router.get('/users', async (req, res) => {
  const users = await User.find().select('-__v');
  res.json(users);
});

module.exports = router;
