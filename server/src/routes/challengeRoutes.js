const express = require('express');
const { verifyToken } = require('../middleware/auth');
const challengeController = require('../controllers/challengeController');

const router = express.Router();

router.use(verifyToken);

router.post('/', challengeController.createChallenge);
router.get('/', challengeController.listChallenges);
router.post('/:challengeId/join', challengeController.joinChallenge);
router.post('/:challengeId/progress', challengeController.updateChallengeProgress);
router.get('/:challengeId/leaderboard', challengeController.getLeaderboard);

module.exports = router;
