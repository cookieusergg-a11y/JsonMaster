const mongoose = require('mongoose');
const SubSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  action: String,
  days: Number,
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  timestamp: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Subscription', SubSchema);
