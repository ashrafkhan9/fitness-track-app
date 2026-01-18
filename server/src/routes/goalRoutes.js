const express = require('express');
const { verifyToken } = require('../middleware/auth');
const goalController = require('../controllers/goalController');

const router = express.Router();

router.use(verifyToken);

router.post('/', goalController.createGoal);
router.get('/', goalController.listGoals);
router.patch('/:goalId', goalController.updateGoal);
router.post('/:goalId/progress', goalController.logGoalProgress);

module.exports = router;
