import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import env from './config/env.js';
import { connectDB } from './config/db.js';
import routes from './routes/index.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

const app = express();

app.set('trust proxy', 1);
app.use(helmet());
app.use(
  cors({
    origin: env.CORS_ORIGIN === '*' ? true : env.CORS_ORIGIN.split(',').map((o) => o.trim()),
  }),
);
app.use(compression());
app.use(express.json({ limit: '100kb' }));
if (!env.isProd) app.use(morgan('dev'));
app.use(
  '/api',
  rateLimit({
    windowMs: 60_000,
    limit: 300,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    // Serverless requests have no socket IP; Netlify forwards it in a header instead.
    keyGenerator: (req) => req.ip || req.headers['x-nf-client-connection-ip'] || 'anonymous',
    validate: { ip: false },
  }),
);

// Lazily connect so the same app works for a long-running server and serverless functions.
app.use('/api', async (_req, _res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    next(err);
  }
});

app.use('/api', routes);
app.use(notFound);
app.use(errorHandler);

export default app;
