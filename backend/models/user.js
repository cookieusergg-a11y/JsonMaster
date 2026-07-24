const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  telegramId: { type: String, unique: true, required: true },
  username: String,
  firstName: String,
  lastName: String,
  photoUrl: String,
  subscription: { type: String, enum: ['trial','premium','pro','lifetime'], default: 'trial' },
  trialStart: { type: Date, default: Date.now },
  trialEnd: { type: Date, default: () => new Date(+new Date() + 7*24*60*60*1000) },
  premiumUntil: Date,
  isAdmin: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('User', UserSchema);
