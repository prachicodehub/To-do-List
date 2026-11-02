import { Router } from 'express';
import mongoose from 'mongoose';
import taskRoutes from './task.routes.js';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({ status: 'ok', db: mongoose.connection.readyState === 1 ? 'up' : 'down' });
});

router.use('/tasks', taskRoutes);

export default router;
