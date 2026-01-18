const express = require('express');
const { verifyToken } = require('../middleware/auth');
const healthController = require('../controllers/healthController');

const router = express.Router();

router.use(verifyToken);

router.post('/', healthController.logMetric);
router.get('/', healthController.listMetrics);
router.get('/dashboard', healthController.dashboard);

module.exports = router;
