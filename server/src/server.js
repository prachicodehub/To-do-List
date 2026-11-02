import app from './app.js';
import env from './config/env.js';
import { connectDB, disconnectDB } from './config/db.js';

await connectDB();

const server = app.listen(env.PORT, () => {
  console.log(`API listening on http://localhost:${env.PORT}/api`);
});

const shutdown = (signal) => {
  console.log(`${signal} received, shutting down`);
  server.close(async () => {
    await disconnectDB();
    process.exit(0);
  });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
