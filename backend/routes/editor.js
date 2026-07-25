const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

router.get('/config', auth, async (req, res) => {
  const user = req.user;
  let showWatermark = true;
  if (user.subscription === 'lifetime' || user.subscription === 'pro' || user.subscription === 'premium') showWatermark = false;
  else if (user.subscription === 'trial' && new Date() < user.trialEnd) showWatermark = false;
  res.json({ showWatermark, userId: user.telegramId });
});

router.post('/export', auth, async (req, res) => {
  const user = req.user;
  let watermark = true;
  if (user.subscription === 'lifetime' || user.subscription === 'pro' || user.subscription === 'premium') watermark = false;
  else if (user.subscription === 'trial' && new Date() < user.trialEnd) watermark = false;
  res.json({ url: '/output/project.mp4', watermark });
});

module.exports = router;