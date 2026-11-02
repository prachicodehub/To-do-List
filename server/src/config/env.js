// Centralised, validated runtime configuration.
const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: Number(process.env.PORT) || 5000,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/todo_app',
  // Comma-separated list of allowed origins, or "*" for any.
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
};

env.isProd = env.NODE_ENV === 'production';

export default env;
