const Challenge = require('../models/Challenge');
const asyncHandler = require('../utils/asyncHandler');

const createChallenge = asyncHandler(async (req, res) => {
  const challenge = await Challenge.create({
    ...req.body,
    createdBy: req.user.id,
  });
  res.status(201).json(challenge);
});

const listChallenges = asyncHandler(async (req, res) => {
  const challenges = await Challenge.find({
    $or: [
      { isPublic: true },
      { createdBy: req.user.id },
      { 'participants.user': req.user.id },
    ],
  }).sort({ startDate: 1 });

  res.json(challenges);
});

const joinChallenge = asyncHandler(async (req, res) => {
  const { challengeId } = req.params;
  const { profileId } = req.body;

  const challenge = await Challenge.findById(challengeId);
  if (!challenge) {
    return res.status(404).json({ message: 'Challenge not found' });
  }

  const existing = challenge.participants.find(
    (participant) => participant.user.toString() === req.user.id && String(participant.profileId) === String(profileId),
  );

  if (existing) {
    return res.status(400).json({ message: 'Already enrolled in challenge' });
  }

  challenge.participants.push({
    user: req.user.id,
    profileId,
  });

  await challenge.save();
  res.json(challenge);
});

const updateChallengeProgress = asyncHandler(async (req, res) => {
  const { challengeId } = req.params;
  const { progress, profileId } = req.body;

  const challenge = await Challenge.findById(challengeId);
  if (!challenge) {
    return res.status(404).json({ message: 'Challenge not found' });
  }

  const participant = challenge.participants.find(
    (entry) => entry.user.toString() === req.user.id && String(entry.profileId) === String(profileId),
  );

  if (!participant) {
    return res.status(400).json({ message: 'Not enrolled in this challenge' });
  }

  participant.progress = progress;
  participant.lastUpdatedAt = new Date();
  await challenge.save();
  res.json(challenge);
});

const getLeaderboard = asyncHandler(async (req, res) => {
  const { challengeId } = req.params;
  const challenge = await Challenge.findById(challengeId).populate('participants.user', 'name');

  if (!challenge) {
    return res.status(404).json({ message: 'Challenge not found' });
  }

  const leaderboard = [...challenge.participants]
    .sort((a, b) => b.progress - a.progress)
    .map((participant, index) => ({
      rank: index + 1,
      user: participant.user?.name || 'Unknown',
      progress: participant.progress,
      lastUpdatedAt: participant.lastUpdatedAt,
    }));

  res.json({ challenge: challenge.title, leaderboard });
});

module.exports = {
  createChallenge,
  listChallenges,
  joinChallenge,
  updateChallengeProgress,
  getLeaderboard,
};
