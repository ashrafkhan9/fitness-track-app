const mongoose = require('mongoose');

const ParticipantSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  profileId: { type: mongoose.Schema.Types.ObjectId },
  progress: { type: Number, default: 0 },
  lastUpdatedAt: { type: Date, default: Date.now },
}, { _id: false });

const ChallengeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  metric: {
    type: String,
    enum: ['steps', 'calories', 'workouts', 'duration'],
    default: 'steps',
  },
  target: { type: Number, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  participants: { type: [ParticipantSchema], default: [] },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isPublic: { type: Boolean, default: true },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Challenge', ChallengeSchema);
