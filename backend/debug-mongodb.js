const { MongoMemoryServer } = require('mongodb-memory-server');
(async () => {
  try {
    console.log('NODE', process.version);
    const m = await MongoMemoryServer.create({
      instance: { port: 27018 },
      binary: { version: '6.0.8' },
      debug: true,
    });
    console.log('uri', m.getUri());
    await m.stop();
    console.log('stopped');
  } catch (err) {
    console.error('ERROR', err);
    process.exit(1);
  }
})();
