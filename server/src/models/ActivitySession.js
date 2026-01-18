const mongoose = require('mongoose');

const ActivitySessionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  profileId: { type: mongoose.Schema.Types.ObjectId },
  activityType: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  startedAt: { type: Date, default: Date.now },
  endedAt: Date,
  route: {
    type: [{
      latitude: Number,
      longitude: Number,
      accuracy: Number,
      altitude: Number,
      speed: Number,
      timestamp: Date,
    }],
    default: [],
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('ActivitySession', ActivitySessionSchema);
