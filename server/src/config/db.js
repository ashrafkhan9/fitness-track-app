const mongoose = require('mongoose');

const connectDb = async () => {
  const connectionUri = process.env.MONGO_URI;
  if (!connectionUri) {
    throw new Error('Missing MONGO_URI environment variable');
  }

  mongoose.set('strictQuery', true);

  await mongoose.connect(connectionUri, {
    autoIndex: true,
  });
};

module.exports = connectDb;
