const mongoose = require('mongoose');

const WeightEntrySchema = new mongoose.Schema({
  value: { type: Number, required: true },
  unit: { type: String, enum: ['kg', 'lb'], default: 'kg' },
  recordedAt: { type: Date, default: Date.now },
}, { _id: false });

const WearableConnectionSchema = new mongoose.Schema({
  provider: { type: String, enum: ['fitbit', 'apple', 'google-fit', 'strava'], required: true },
  externalUserId: String,
  accessToken: String,
  refreshToken: String,
  expiresAt: Date,
  scopes: [String],
}, { _id: false });

const ProfileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  avatarUrl: String,
  birthDate: Date,
  gender: { type: String, enum: ['male', 'female', 'non-binary', 'prefer-not-to-say'], default: 'prefer-not-to-say' },
  heightCm: Number,
  weightHistory: { type: [WeightEntrySchema], default: [] },
  preferences: {
    workoutTypes: { type: [String], default: [] },
    weeklyGoalMinutes: { type: Number, default: 150 },
    calorieTarget: Number,
    stepTarget: Number,
  },
  wearableConnections: { type: [WearableConnectionSchema], default: [] },
}, { _id: true });

const ResetPasswordSchema = new mongoose.Schema({
  tokenHash: String,
  expiresAt: Date,
}, { _id: false });

const NotificationSettingsSchema = new mongoose.Schema({
  emailReminders: { type: Boolean, default: true },
  pushReminders: { type: Boolean, default: true },
  reminderWindow: {
    startHour: { type: Number, default: 7 },
    endHour: { type: Number, default: 21 },
  },
  timezone: { type: String, default: 'UTC' },
}, { _id: false });

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  profiles: { type: [ProfileSchema], default: [] },
  resetPassword: ResetPasswordSchema,
  refreshTokens: { type: [String], default: [] },
  firebaseTokens: { type: [String], default: [] },
  notificationSettings: { type: NotificationSettingsSchema, default: () => ({}) },
}, {
  timestamps: true,
});

UserSchema.methods.toJSON = function toJSON() {
  const obj = this.toObject();
  delete obj.passwordHash;
  delete obj.resetPassword;
  delete obj.refreshTokens;
  return obj;
};

module.exports = mongoose.model('User', UserSchema);
