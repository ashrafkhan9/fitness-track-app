const asyncHandler = require('../utils/asyncHandler');

const listProfiles = asyncHandler(async (req, res) => {
  res.json(req.user.profiles);
});

const createProfile = asyncHandler(async (req, res) => {
  req.user.profiles.push(req.body);
  await req.user.save();
  res.status(201).json(req.user.profiles);
});

const updateProfile = asyncHandler(async (req, res) => {
  const { profileId } = req.params;
  const profile = req.user.profiles.id(profileId);

  if (!profile) {
    return res.status(404).json({ message: 'Profile not found' });
  }

  Object.assign(profile, req.body);
  await req.user.save();
  res.json(profile);
});

const removeProfile = asyncHandler(async (req, res) => {
  const { profileId } = req.params;
  const profile = req.user.profiles.id(profileId);

  if (!profile) {
    return res.status(404).json({ message: 'Profile not found' });
  }

  profile.deleteOne();
  await req.user.save();
  res.json({ message: 'Profile removed' });
});

const recordWeight = asyncHandler(async (req, res) => {
  const { profileId } = req.params;
  const profile = req.user.profiles.id(profileId);

  if (!profile) {
    return res.status(404).json({ message: 'Profile not found' });
  }

  profile.weightHistory.push(req.body);
  await req.user.save();
  res.json(profile.weightHistory);
});

module.exports = {
  listProfiles,
  createProfile,
  updateProfile,
  removeProfile,
  recordWeight,
};
