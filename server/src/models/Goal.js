const mongoose = require('mongoose');

const ProgressEntrySchema = new mongoose.Schema({
  value: { type: Number, required: true },
  recordedAt: { type: Date, default: Date.now },
  note: String,
}, { _id: false });

const GoalSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  profileId: { type: mongoose.Schema.Types.ObjectId },
  category: {
    type: String,
    enum: ['weight', 'calories', 'steps', 'duration', 'custom'],
    default: 'custom',
  },
  title: { type: String, required: true },
  targetValue: { type: Number, required: true },
  currentValue: { type: Number, default: 0 },
  unit: { type: String, default: 'count' },
  startDate: { type: Date, default: Date.now },
  dueDate: Date,
  progressHistory: { type: [ProgressEntrySchema], default: [] },
  isCompleted: { type: Boolean, default: false },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Goal', GoalSchema);
