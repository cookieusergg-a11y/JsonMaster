const mongoose = require('mongoose');

const CodeSchema = new mongoose.Schema({
  telegramId: { type: String, required: true, unique: true },
  code: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now, expires: '10m' }
});

module.exports = mongoose.model('Code', CodeSchema);