import mongoose from 'mongoose';
import env from './env.js';
import ApiError from '../utils/ApiError.js';

// Cache the connection promise so serverless invocations (Netlify Functions)
// reuse one connection per warm container instead of opening a new one per request.
let connection = null;

export async function connectDB() {
  if (connection) return connection;

  if (env.isProd && !process.env.MONGODB_URI) {
    throw new ApiError(503, 'Database not configured: set the MONGODB_URI environment variable');
  }

  mongoose.set('strictQuery', true);
  connection = mongoose
    .connect(env.MONGODB_URI, { serverSelectionTimeoutMS: 8000, maxPoolSize: 10 })
    .then((m) => {
      console.log(`MongoDB connected: ${m.connection.host}/${m.connection.name}`);
      return m;
    })
    .catch((err) => {
      connection = null;
      console.error('MongoDB connection failed:', err);
      // Safe, actionable message (never includes the connection string).
      const hint =
        err.name === 'MongooseServerSelectionError'
          ? 'cannot reach the database server (check Atlas Network Access allows 0.0.0.0/0)'
          : err.name === 'MongoParseError'
            ? 'MONGODB_URI is malformed'
            : /auth/i.test(err.message)
              ? 'authentication failed (check the username/password in MONGODB_URI)'
              : err.name;
      throw new ApiError(503, `Database unavailable: ${hint}`);
    });

  return connection;
}

export async function disconnectDB() {
  await mongoose.disconnect();
  connection = null;
}
