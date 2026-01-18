const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { v4: uuid } = require('uuid');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const { createAccessToken, createRefreshToken } = require('../utils/token');
const { sendPasswordResetEmail } = require('../services/notificationService');

const setRefreshCookie = (res, token) => {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

const register = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    password,
    profile,
  } = req.body;

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    return res.status(409).json({ message: 'Email already registered' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email: email.toLowerCase(),
    passwordHash,
    profiles: profile ? [profile] : [],
  });

  const accessToken = createAccessToken({ sub: user.id });
  const refreshToken = createRefreshToken({ sub: user.id });

  user.refreshTokens.push(refreshToken);
  await user.save();

  setRefreshCookie(res, refreshToken);
  res.status(201).json({ user, accessToken });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const accessToken = createAccessToken({ sub: user.id });
  const refreshToken = createRefreshToken({ sub: user.id });
  user.refreshTokens.push(refreshToken);
  await user.save();

  setRefreshCookie(res, refreshToken);
  res.json({ user, accessToken });
});

const refreshToken = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken || req.body?.refreshToken;
  if (!token) {
    return res.status(401).json({ message: 'No refresh token found' });
  }

  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret) {
    throw new Error('Missing JWT_REFRESH_SECRET');
  }

  let decoded;
  try {
    decoded = jwt.verify(token, secret);
  } catch (error) {
    return res.status(401).json({ message: 'Invalid refresh token' });
  }

  const user = await User.findById(decoded.sub);
  if (!user) {
    return res.status(401).json({ message: 'Invalid token subject' });
  }

  if (!user.refreshTokens.includes(token)) {
    return res.status(401).json({ message: 'Refresh token revoked' });
  }

  const newAccessToken = createAccessToken({ sub: user.id });
  const newRefreshToken = createRefreshToken({ sub: user.id });

  user.refreshTokens = user.refreshTokens.filter((existing) => existing !== token);
  user.refreshTokens.push(newRefreshToken);
  await user.save();

  setRefreshCookie(res, newRefreshToken);
  res.json({ accessToken: newAccessToken });
});

const logout = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken;

  if (token) {
    const secret = process.env.JWT_REFRESH_SECRET;
    try {
      const decoded = jwt.verify(token, secret);
      const user = await User.findById(decoded.sub);
      if (user) {
        user.refreshTokens = user.refreshTokens.filter((existing) => existing !== token);
        await user.save();
      }
    } catch (error) {
      // ignore invalid token
    }
  }

  res.clearCookie('refreshToken');
  res.json({ message: 'Logged out' });
});

const requestPasswordReset = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    return res.status(200).json({ message: 'If the email exists, a reset link will be sent' });
  }

  const resetToken = uuid();
  const tokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

  user.resetPassword = {
    tokenHash,
    expiresAt: new Date(Date.now() + 60 * 60 * 1000),
  };
  await user.save();

  await sendPasswordResetEmail(user, resetToken);

  res.json({ message: 'Password reset email sent' });
});

const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    'resetPassword.tokenHash': tokenHash,
    'resetPassword.expiresAt': { $gt: new Date() },
  });

  if (!user) {
    return res.status(400).json({ message: 'Invalid or expired token' });
  }

  user.passwordHash = await bcrypt.hash(password, 10);
  user.resetPassword = undefined;
  user.refreshTokens = [];
  await user.save();

  res.json({ message: 'Password has been reset' });
});

const currentUser = asyncHandler(async (req, res) => {
  res.json(req.user);
});

module.exports = {
  register,
  login,
  refreshToken,
  logout,
  requestPasswordReset,
  resetPassword,
  currentUser,
};
