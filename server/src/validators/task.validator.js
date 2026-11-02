import { z } from 'zod';
import { PRIORITIES, STATUSES } from '../models/Task.js';

const isoDate = z.coerce.date({ invalid_type_error: 'Must be a valid date' });

const base = {
  title: z.string().trim().min(1, 'Title is required').max(120),
  description: z.string().trim().max(2000).optional().default(''),
  dueAt: isoDate,
  endAt: isoDate.nullable().optional(),
  priority: z.enum(PRIORITIES).nullable().optional(),
  status: z.enum(STATUSES).optional(),
};

const endAfterStart = (t) => !t.endAt || !t.dueAt || t.endAt >= t.dueAt;
const endMsg = { message: 'End time must be after start time', path: ['endAt'] };

export const createTaskSchema = z.object(base).refine(endAfterStart, endMsg);

export const updateTaskSchema = z
  .object({ ...base, description: z.string().trim().max(2000) })
  .partial()
  .refine((v) => Object.keys(v).length > 0, 'Provide at least one field to update')
  .refine(endAfterStart, endMsg);

export const statusSchema = z.object({ status: z.enum(STATUSES) });

export const listQuerySchema = z.object({
  search: z.string().trim().max(100).optional(),
  from: isoDate.optional(),
  to: isoDate.optional(),
  status: z.enum(STATUSES).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(200).default(50),
});

export const weeksQuerySchema = z.object({
  tz: z
    .string()
    .default('UTC')
    .refine((tz) => {
      try {
        Intl.DateTimeFormat('en-US', { timeZone: tz });
        return true;
      } catch {
        return false;
      }
    }, 'Unknown time zone'),
});

export const idParamSchema = z.object({
  id: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid task id'),
});
