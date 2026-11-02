import { ZodError } from 'zod';
import mongoose from 'mongoose';
import env from '../config/env.js';
import ApiError from '../utils/ApiError.js';

export function notFound(req, res) {
  res.status(404).json({ error: { message: `Route not found: ${req.method} ${req.originalUrl}` } });
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, _req, res, _next) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: {
        message: err.issues[0]?.message || 'Validation failed',
        details: err.issues.map((i) => ({ field: i.path.join('.'), message: i.message })),
      },
    });
  }

  if (err instanceof mongoose.Error.ValidationError) {
    return res.status(400).json({ error: { message: err.message } });
  }

  const status = err.status || 500;
  if (status >= 500) console.error(err);

  res.status(status).json({
    error: {
      // ApiErrors carry deliberate, safe messages; hide only unexpected 5xx details in production.
      message: status >= 500 && env.isProd && !(err instanceof ApiError) ? 'Internal server error' : err.message,
      ...(err.details && { details: err.details }),
    },
  });
}
