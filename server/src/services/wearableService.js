const axios = require('axios');

const FITBIT_BASE = 'https://api.fitbit.com/1/user';

const fetchFitbitDailySummary = async (connection) => {
  if (!connection?.accessToken || !connection?.externalUserId) {
    return {
      mocked: true,
      steps: 6500,
      caloriesOut: 2100,
      distance: 5.2,
      source: 'fitbit',
    };
  }

  const today = new Date().toISOString().slice(0, 10);
  const url = `${FITBIT_BASE}/${connection.externalUserId}/activities/date/${today}.json`;

  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${connection.accessToken}`,
    },
  });

  const { summary } = response.data;
  return {
    steps: summary.steps,
    caloriesOut: summary.caloriesOut,
    distance: summary.distances?.[0]?.distance ?? 0,
    source: 'fitbit',
  };
};

const syncWearableConnection = async (connection) => {
  switch (connection.provider) {
    case 'fitbit':
      return fetchFitbitDailySummary(connection);
    default:
      return {
        mocked: true,
        steps: 5000,
        caloriesOut: 1800,
        distance: 4,
        source: connection.provider ?? 'unknown',
      };
  }
};

module.exports = {
  syncWearableConnection,
};
