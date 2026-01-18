const express = require('express');
const { verifyToken } = require('../middleware/auth');
const notificationController = require('../controllers/notificationController');

const router = express.Router();

router.use(verifyToken);

router.post('/push-token', notificationController.registerPushToken);
router.patch('/settings', notificationController.updateNotificationSettings);
router.post('/test', notificationController.sendTestNotification);

module.exports = router;
