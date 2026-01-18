const mongoose = require('mongoose');

const HealthMetricSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  profileId: { type: mongoose.Schema.Types.ObjectId },
  metric: {
    type: String,
    enum: ['sleep', 'water', 'blood-pressure', 'heart-rate', 'weight', 'custom'],
    required: true,
  },
  value: { type: Number, required: true },
  unit: { type: String, default: 'count' },
  recordedAt: { type: Date, default: Date.now },
  metadata: mongoose.Schema.Types.Mixed,
}, {
  timestamps: true,
});

module.exports = mongoose.model('HealthMetric', HealthMetricSchema);
