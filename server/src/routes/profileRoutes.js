const express = require('express');
const { verifyToken } = require('../middleware/auth');
const profileController = require('../controllers/profileController');

const router = express.Router();

router.use(verifyToken);

router.get('/', profileController.listProfiles);
router.post('/', profileController.createProfile);
router.patch('/:profileId', profileController.updateProfile);
router.delete('/:profileId', profileController.removeProfile);
router.post('/:profileId/weight', profileController.recordWeight);

module.exports = router;
