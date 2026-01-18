const asyncHandler = require('../utils/asyncHandler');
const { sendPushNotification } = require('../services/notificationService');
const NotificationLog = require('../models/NotificationLog');

const registerPushToken = asyncHandler(async (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ message: 'Token required' });
  }

  if (!req.user.firebaseTokens.includes(token)) {
    req.user.firebaseTokens.push(token);
    await req.user.save();
  }

  res.json({ tokens: req.user.firebaseTokens });
});

const updateNotificationSettings = asyncHandler(async (req, res) => {
  req.user.notificationSettings = {
    ...req.user.notificationSettings.toObject?.() ?? req.user.notificationSettings,
    ...req.body,
  };
  await req.user.save();
  res.json(req.user.notificationSettings);
});

const sendTestNotification = asyncHandler(async (req, res) => {
  if (req.user.firebaseTokens.length === 0) {
    return res.status(400).json({ message: 'No registered push tokens' });
  }

  const payload = {
    title: 'Test notification',
    body: 'Your Fitness Tracker push notifications are working!',
  };

  await sendPushNotification(req.user.firebaseTokens, payload);
  await NotificationLog.create({
    user: req.user.id,
    channel: 'push',
    template: 'test',
    payload,
  });

  res.json({ message: 'Notification dispatched' });
});

module.exports = {
  registerPushToken,
  updateNotificationSettings,
  sendTestNotification,
};
