const asyncHandler = require('../utils/asyncHandler');
const { syncWearableConnection } = require('../services/wearableService');
const HealthMetric = require('../models/HealthMetric');

const listConnections = asyncHandler(async (req, res) => {
  const { profileId } = req.params;
  const profile = req.user.profiles.id(profileId);

  if (!profile) {
    return res.status(404).json({ message: 'Profile not found' });
  }

  res.json(profile.wearableConnections);
});

const addConnection = asyncHandler(async (req, res) => {
  const { profileId } = req.params;
  const profile = req.user.profiles.id(profileId);

  if (!profile) {
    return res.status(404).json({ message: 'Profile not found' });
  }

  profile.wearableConnections.push(req.body);
  await req.user.save();

  res.status(201).json(profile.wearableConnections);
});

const syncConnection = asyncHandler(async (req, res) => {
  const { profileId, connectionId } = req.params;
  const profile = req.user.profiles.id(profileId);

  if (!profile) {
    return res.status(404).json({ message: 'Profile not found' });
  }

  const connection = profile.wearableConnections.id(connectionId);
  if (!connection) {
    return res.status(404).json({ message: 'Connection not found' });
  }

  const summary = await syncWearableConnection(connection);

  if (summary.steps) {
    await HealthMetric.create({
      user: req.user.id,
      profileId,
      metric: 'steps',
      value: summary.steps,
      unit: 'count',
    });
  }

  res.json(summary);
});

module.exports = {
  listConnections,
  addConnection,
  syncConnection,
};
