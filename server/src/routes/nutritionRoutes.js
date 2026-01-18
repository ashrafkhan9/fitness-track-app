const express = require('express');
const { verifyToken } = require('../middleware/auth');
const nutritionController = require('../controllers/nutritionController');

const router = express.Router();

router.use(verifyToken);

router.post('/search', nutritionController.searchFoods);
router.get('/barcode/:barcode', nutritionController.fetchByBarcode);
router.post('/', nutritionController.logNutrition);
router.get('/', nutritionController.listNutritionLogs);

module.exports = router;
