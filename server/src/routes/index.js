const { Server } = require('socket.io');
const authRoutes = require('./authRoutes');
const workoutRoutes = require('./workoutRoutes');
const goalRoutes = require('./goalRoutes');
const nutritionRoutes = require('./nutritionRoutes');
const challengeRoutes = require('./challengeRoutes');
const wearableRoutes = require('./wearableRoutes');
const healthRoutes = require('./healthRoutes');
const notificationRoutes = require('./notificationRoutes');
const profileRoutes = require('./profileRoutes');

const registerRoutes = (app, server) => {
  app.get('/api/health-check', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/workouts', workoutRoutes);
  app.use('/api/goals', goalRoutes);
  app.use('/api/nutrition', nutritionRoutes);
  app.use('/api/challenges', challengeRoutes);
  app.use('/api/wearables', wearableRoutes);
  app.use('/api/health-metrics', healthRoutes);
  app.use('/api/notifications', notificationRoutes);
  app.use('/api/profiles', profileRoutes);

  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
      credentials: true,
    },
  });

  app.set('io', io);

  io.on('connection', (socket) => {
    socket.on('activity:update', (payload) => {
      socket.broadcast.emit('activity:remote-update', payload);
    });
  });
};

module.exports = registerRoutes;
