const express = require('express');
const http = require('http');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');

const connectDb = require('./config/db');
const registerRoutes = require('./routes');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();

const app = express();
const server = http.createServer(app);

app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

registerRoutes(app, server);
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});
app.use(errorHandler);

const port = process.env.PORT || 5000;

connectDb().then(() => {
  server.listen(port, () => {
    /* eslint-disable no-console */
    console.log(`Server listening on port ${port}`);
    /* eslint-enable no-console */
  });
}).catch((err) => {
  console.error('Failed to connect database', err);
  process.exit(1);
});
