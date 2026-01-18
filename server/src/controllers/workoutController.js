const Workout = require('../models/Workout');
const ActivitySession = require('../models/ActivitySession');
const asyncHandler = require('../utils/asyncHandler');
const { getSuggestionFromMetrics } = require('../services/suggestionService');
const Goal = require('../models/Goal');

const estimateCalories = (type, duration, weightKg = 70) => {
  const metTable = {
    running: 9.8,
    walking: 3.5,
    cycling: 7,
    yoga: 3,
    swimming: 8,
    strength: 6,
    hiit: 10,
  };

  const met = metTable[type?.toLowerCase()] || 6;
  return Math.round((met * 3.5 * weightKg / 200) * duration);
};

const haversineDistanceKm = (pointA, pointB) => {
  const toRad = (value) => (value * Math.PI) / 180;
  const earthRadiusKm = 6371;
  const dLat = toRad(pointB.latitude - pointA.latitude);
  const dLon = toRad(pointB.longitude - pointA.longitude);
  const lat1 = toRad(pointA.latitude);
  const lat2 = toRad(pointB.latitude);

  const a = Math.sin(dLat / 2) ** 2
    + Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusKm * c;
};

const logWorkout = asyncHandler(async (req, res) => {
  const {
    type,
    durationMinutes,
    caloriesBurned,
    steps,
    distanceKm,
    intensity,
    notes,
    profileId,
    route,
  } = req.body;

  const profile = req.user.profiles.id(profileId) || req.user.profiles[0];
  const weightEntry = profile?.weightHistory?.slice(-1)?.[0];
  const weightKg = weightEntry?.unit === 'lb'
    ? weightEntry.value / 2.205
    : weightEntry?.value ?? 70;

  const workout = await Workout.create({
    user: req.user.id,
    profileId,
    type,
    durationMinutes,
    caloriesBurned: caloriesBurned ?? estimateCalories(type, durationMinutes, weightKg),
    steps,
    distanceKm,
    intensity,
    notes,
    route,
  });

  res.status(201).json(workout);
});

const listWorkouts = asyncHandler(async (req, res) => {
  const { from, to, profileId } = req.query;
  const query = { user: req.user.id };

  if (profileId) {
    query.profileId = profileId;
  }

  if (from || to) {
    query.startTime = {};
    if (from) query.startTime.$gte = new Date(from);
    if (to) query.startTime.$lte = new Date(to);
  }

  const workouts = await Workout.find(query).sort({ startTime: -1 });
  res.json(workouts);
});

const getStats = asyncHandler(async (req, res) => {
  const { range = '7d', profileId } = req.query;
  const since = new Date();

  switch (range) {
    case '30d':
      since.setDate(since.getDate() - 30);
      break;
    case '90d':
      since.setDate(since.getDate() - 90);
      break;
    default:
      since.setDate(since.getDate() - 7);
  }

  const match = {
    user: req.user._id,
    createdAt: { $gte: since },
  };

  if (profileId) {
    match.profileId = profileId;
  }

  const [summary] = await Workout.aggregate([
    { $match: match },
    {
      $group: {
        _id: null,
        totalDuration: { $sum: '$durationMinutes' },
        totalCalories: { $sum: '$caloriesBurned' },
        totalSteps: { $sum: '$steps' },
        workouts: { $push: '$$ROOT' },
      },
    },
  ]);

  res.json(summary ?? {
    totalDuration: 0,
    totalCalories: 0,
    totalSteps: 0,
    workouts: [],
  });
});

const startLiveSession = asyncHandler(async (req, res) => {
  const { activityType, profileId } = req.body;
  const session = await ActivitySession.create({
    user: req.user.id,
    profileId,
    activityType,
  });

  res.status(201).json(session);
});

const updateLiveSession = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;
  const {
    latitude,
    longitude,
    accuracy,
    altitude,
    speed,
    timestamp,
  } = req.body;

  const session = await ActivitySession.findOneAndUpdate(
    { _id: sessionId, user: req.user.id, isActive: true },
    {
      $push: {
        route: {
          latitude,
          longitude,
          accuracy,
          altitude,
          speed,
          timestamp: timestamp ? new Date(timestamp) : new Date(),
        },
      },
    },
    { new: true },
  );

  if (!session) {
    return res.status(404).json({ message: 'Session not found' });
  }

  const io = req.app.get('io');
  if (io) {
    io.emit('activity:remote-update', {
      sessionId,
      point: session.route.at(-1),
    });
  }

  res.json(session);
});

const endLiveSession = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;
  const session = await ActivitySession.findOneAndUpdate(
    { _id: sessionId, user: req.user.id, isActive: true },
    { isActive: false, endedAt: new Date() },
    { new: true },
  );

  if (!session) {
    return res.status(404).json({ message: 'Session not found' });
  }

  let distanceKm = 0;
  if (session.route.length > 1) {
    for (let i = 1; i < session.route.length; i += 1) {
      distanceKm += haversineDistanceKm(session.route[i - 1], session.route[i]);
    }
  }

  const durationMinutes = (session.endedAt - session.startedAt) / (1000 * 60);

  await Workout.create({
    user: session.user,
    profileId: session.profileId,
    sessionId: session._id,
    type: session.activityType,
    durationMinutes,
    caloriesBurned: estimateCalories(session.activityType, durationMinutes),
    distanceKm: Number(distanceKm.toFixed(2)),
    intensity: 'moderate',
    startTime: session.startedAt,
    route: session.route,
  });

  const io = req.app.get('io');
  if (io) {
    io.emit('activity:session-complete', { sessionId });
  }

  res.json(session);
});

const getSuggestions = asyncHandler(async (req, res) => {
  const recentWorkouts = await Workout.find({ user: req.user.id })
    .sort({ startTime: -1 })
    .limit(5)
    .lean();
  const goals = await Goal.find({ user: req.user.id }).lean();

  res.json(getSuggestionFromMetrics({ recentWorkouts, goals }));
});

module.exports = {
  logWorkout,
  listWorkouts,
  getStats,
  startLiveSession,
  updateLiveSession,
  endLiveSession,
  getSuggestions,
};
