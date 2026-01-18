const express = require('express');
const { verifyToken } = require('../middleware/auth');
const workoutController = require('../controllers/workoutController');

const router = express.Router();

router.use(verifyToken);

router.post('/', workoutController.logWorkout);
router.get('/', workoutController.listWorkouts);
router.get('/stats', workoutController.getStats);
router.post('/live', workoutController.startLiveSession);
router.post('/live/:sessionId', workoutController.updateLiveSession);
router.post('/live/:sessionId/end', workoutController.endLiveSession);
router.get('/suggestions', workoutController.getSuggestions);

module.exports = router;
