const express = require('express');
const { verifyToken } = require('../middleware/auth');
const wearableController = require('../controllers/wearableController');

const router = express.Router();

router.use(verifyToken);

router.get('/:profileId', wearableController.listConnections);
router.post('/:profileId', wearableController.addConnection);
router.post('/:profileId/:connectionId/sync', wearableController.syncConnection);

module.exports = router;
