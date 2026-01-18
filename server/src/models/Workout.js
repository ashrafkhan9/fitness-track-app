const mongoose = require('mongoose');

const GeoPointSchema = new mongoose.Schema({
  latitude: Number,
  longitude: Number,
  timestamp: Date,
}, { _id: false });

const WorkoutSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  profileId: { type: mongoose.Schema.Types.ObjectId },
  sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'ActivitySession' },
  type: { type: String, required: true },
  durationMinutes: { type: Number, required: true },
  caloriesBurned: Number,
  steps: Number,
  distanceKm: Number,
  intensity: { type: String, enum: ['low', 'moderate', 'high'], default: 'moderate' },
  startTime: { type: Date, default: Date.now },
  notes: String,
  route: { type: [GeoPointSchema], default: [] },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Workout', WorkoutSchema);
