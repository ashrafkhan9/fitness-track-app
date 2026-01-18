const jwt = require('jsonwebtoken');
const User = require('../models/User');

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;

    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('Missing JWT_SECRET');
    }

    const decoded = jwt.verify(token, secret);

    const user = await User.findById(decoded.sub);
    if (!user) {
      return res.status(401).json({ message: 'Invalid token subject' });
    }

    req.user = user;
    req.tokenPayload = decoded;
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = {
  verifyToken,
};
