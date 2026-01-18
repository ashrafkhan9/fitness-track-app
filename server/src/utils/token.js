const jwt = require('jsonwebtoken');

const createAccessToken = (payload) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('Missing JWT_SECRET');
  }

  return jwt.sign(payload, secret, { expiresIn: '15m' });
};

const createRefreshToken = (payload) => {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret) {
    throw new Error('Missing JWT_REFRESH_SECRET');
  }

  return jwt.sign(payload, secret, { expiresIn: '7d' });
};

module.exports = {
  createAccessToken,
  createRefreshToken,
};
