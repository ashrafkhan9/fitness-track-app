const HealthMetric = require('../models/HealthMetric');
const asyncHandler = require('../utils/asyncHandler');

const logMetric = asyncHandler(async (req, res) => {
  const metric = await HealthMetric.create({
    ...req.body,
    user: req.user.id,
  });
  res.status(201).json(metric);
});

const listMetrics = asyncHandler(async (req, res) => {
  const { metric, profileId, limit = 30 } = req.query;
  const query = { user: req.user.id };

  if (metric) query.metric = metric;
  if (profileId) query.profileId = profileId;

  const metrics = await HealthMetric.find(query)
    .sort({ recordedAt: -1 })
    .limit(Number(limit));

  res.json(metrics);
});

const dashboard = asyncHandler(async (req, res) => {
  const { profileId } = req.query;
  const match = { user: req.user._id };
  if (profileId) match.profileId = profileId;

  const metrics = await HealthMetric.aggregate([
    { $match: match },
    {
      $group: {
        _id: '$metric',
        latest: { $first: '$$ROOT' },
        history: { $push: '$$ROOT' },
      },
    },
  ]);

  res.json(metrics);
});

module.exports = {
  logMetric,
  listMetrics,
  dashboard,
};
