const NutritionLog = require('../models/NutritionLog');
const asyncHandler = require('../utils/asyncHandler');
const nutritionService = require('../services/nutritionService');

const searchFoods = asyncHandler(async (req, res) => {
  const { query } = req.body;
  const results = await nutritionService.searchFoods(query);
  res.json(results);
});

const fetchByBarcode = asyncHandler(async (req, res) => {
  const { barcode } = req.params;
  const results = await nutritionService.fetchByBarcode(barcode);
  res.json(results);
});

const logNutrition = asyncHandler(async (req, res) => {
  const log = await NutritionLog.create({
    ...req.body,
    user: req.user.id,
  });
  res.status(201).json(log);
});

const listNutritionLogs = asyncHandler(async (req, res) => {
  const { from, to } = req.query;
  const query = { user: req.user.id };

  if (from || to) {
    query.consumedAt = {};
    if (from) query.consumedAt.$gte = new Date(from);
    if (to) query.consumedAt.$lte = new Date(to);
  }

  const logs = await NutritionLog.find(query).sort({ consumedAt: -1 });
  res.json(logs);
});

module.exports = {
  searchFoods,
  fetchByBarcode,
  logNutrition,
  listNutritionLogs,
};
