const Goal = require('../models/Goal');
const asyncHandler = require('../utils/asyncHandler');

const createGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.create({
    ...req.body,
    user: req.user.id,
  });
  res.status(201).json(goal);
});

const listGoals = asyncHandler(async (req, res) => {
  const goals = await Goal.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json(goals);
});

const updateGoal = asyncHandler(async (req, res) => {
  const { goalId } = req.params;
  const goal = await Goal.findOneAndUpdate(
    { _id: goalId, user: req.user.id },
    req.body,
    { new: true },
  );

  if (!goal) {
    return res.status(404).json({ message: 'Goal not found' });
  }

  res.json(goal);
});

const logGoalProgress = asyncHandler(async (req, res) => {
  const { goalId } = req.params;
  const { value, note } = req.body;

  const goal = await Goal.findOne({ _id: goalId, user: req.user.id });
  if (!goal) {
    return res.status(404).json({ message: 'Goal not found' });
  }

  goal.progressHistory.push({ value, note });
  goal.currentValue = value;

  if (value >= goal.targetValue) {
    goal.isCompleted = true;
  }

  await goal.save();
  res.json(goal);
});

module.exports = {
  createGoal,
  listGoals,
  updateGoal,
  logGoalProgress,
};
