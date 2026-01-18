const mongoose = require('mongoose');

const NutritionLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  profileId: { type: mongoose.Schema.Types.ObjectId },
  foodName: { type: String, required: true },
  mealType: { type: String, enum: ['breakfast', 'lunch', 'dinner', 'snack', 'other'], default: 'other' },
  calories: Number,
  protein: Number,
  carbs: Number,
  fat: Number,
  fiber: Number,
  sugar: Number,
  externalRef: {
    source: String,
    itemId: String,
  },
  consumedAt: { type: Date, default: Date.now },
}, {
  timestamps: true,
});

module.exports = mongoose.model('NutritionLog', NutritionLogSchema);
