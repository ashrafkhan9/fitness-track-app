/* eslint-disable no-unused-vars */
const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (res.headersSent) {
    return;
  }

  const status = err.status || 500;
  res.status(status).json({
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
