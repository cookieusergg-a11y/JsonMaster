const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

router.get('/status', auth, async (req, res) => {
  const user = req.user;
  let status = { subscription: user.subscription, trialDaysLeft: 0, premiumUntil: user.premiumUntil };
  if (user.subscription === 'trial') {
    const now = new Date();
    const diff = user.trialEnd - now;
    status.trialDaysLeft = Math.max(0, Math.ceil(diff / (1000*60*60*24)));
  }
  res.json(status);
});

router.get('/check', auth, (req, res) => {
  const user = req.user;
  let hasPro = false;
  if (user.subscription === 'lifetime' || user.subscription === 'pro' || user.subscription === 'premium') hasPro = true;
  else if (user.subscription === 'trial' && new Date() < user.trialEnd) hasPro = true;
  res.json({ hasPro });
});

module.exports = router;
