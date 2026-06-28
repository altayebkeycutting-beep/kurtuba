require('dotenv').config();
const mongoose = require('mongoose');

const atlasUri = process.env.MONGODB_URI;
const localUri = 'mongodb://127.0.0.1:27017/kurtuba';

const testConnection = async (uri, name) => {
  try {
    const conn = await mongoose.createConnection(uri, { useNewUrlParser: true, useUnifiedTopology: true }).asPromise();
    console.log(`${name} connected:`, conn.host || conn.name);
    await conn.close();
  } catch (error) {
    console.error(`${name} error:`, error.message);
  }
};

(async () => {
  console.log('Testing MongoDB connections...');
  console.log('Atlas URI:', atlasUri ? atlasUri.replace(/:(.*)@/, ':*****@') : 'NONE');
  await testConnection(atlasUri, 'Atlas');
  await testConnection(localUri, 'Local');
  process.exit(0);
})();
