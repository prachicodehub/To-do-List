import mongoose from 'mongoose';
import env from './env.js';

// Cache the connection promise so serverless invocations (Netlify Functions)
// reuse one connection per warm container instead of opening a new one per request.
let connection = null;

export async function connectDB() {
  if (connection) return connection;

  mongoose.set('strictQuery', true);
  connection = mongoose
    .connect(env.MONGODB_URI, { serverSelectionTimeoutMS: 8000, maxPoolSize: 10 })
    .then((m) => {
      console.log(`MongoDB connected: ${m.connection.host}/${m.connection.name}`);
      return m;
    })
    .catch((err) => {
      connection = null;
      throw err;
    });

  return connection;
}

export async function disconnectDB() {
  await mongoose.disconnect();
  connection = null;
}
