const axios = require('axios');

const NUTRITIONIX_BASE = 'https://trackapi.nutritionix.com/v2';

const buildHeaders = () => {
  const appId = process.env.NUTRITIONIX_APP_ID;
  const appKey = process.env.NUTRITIONIX_APP_KEY;

  if (!appId || !appKey) {
    throw new Error('Nutritionix credentials missing');
  }

  return {
    'x-app-id': appId,
    'x-app-key': appKey,
  };
};

const searchFoods = async (query) => {
  try {
    const headers = buildHeaders();
    const response = await axios.post(`${NUTRITIONIX_BASE}/natural/nutrients`, { query }, { headers });
    return response.data;
  } catch (error) {
    if (!process.env.NUTRITIONIX_APP_ID || !process.env.NUTRITIONIX_APP_KEY) {
      return {
        mocked: true,
        foods: [
          { food_name: 'Sample Chicken Breast', nf_calories: 165, nf_protein: 31, nf_total_carbohydrate: 0, nf_total_fat: 3.6 },
        ],
      };
    }
    throw error;
  }
};

const fetchByBarcode = async (barcode) => {
  try {
    const headers = buildHeaders();
    const response = await axios.get(`${NUTRITIONIX_BASE}/search/item?upc=${barcode}`, { headers });
    return response.data;
  } catch (error) {
    if (!process.env.NUTRITIONIX_APP_ID || !process.env.NUTRITIONIX_APP_KEY) {
      return {
        mocked: true,
        foods: [
          { food_name: 'Sample Barcode Item', nf_calories: 200, nf_protein: 5, nf_total_carbohydrate: 30, nf_total_fat: 7 },
        ],
      };
    }
    throw error;
  }
};

module.exports = {
  searchFoods,
  fetchByBarcode,
};
