const mongoose = require('mongoose');

const NotificationLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  profileId: { type: mongoose.Schema.Types.ObjectId },
  channel: { type: String, enum: ['email', 'push'], required: true },
  template: { type: String, required: true },
  payload: mongoose.Schema.Types.Mixed,
  sentAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['sent', 'failed'], default: 'sent' },
  error: String,
}, {
  timestamps: true,
});

module.exports = mongoose.model('NotificationLog', NotificationLogSchema);
