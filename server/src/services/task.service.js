import Task from '../models/Task.js';
import ApiError from '../utils/ApiError.js';

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Data-access layer: controllers stay thin and this is the only place that talks to Mongo.
export async function listTasks({ search, from, to, status, page, limit }) {
  const filter = {};
  if (search) {
    const rx = new RegExp(escapeRegex(search), 'i');
    filter.$or = [{ title: rx }, { description: rx }];
  }
  if (from || to) {
    filter.dueAt = {};
    if (from) filter.dueAt.$gte = from;
    if (to) filter.dueAt.$lt = to;
  }
  if (status) filter.status = status;

  const [items, total] = await Promise.all([
    Task.find(filter)
      .sort({ dueAt: 1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Task.countDocuments(filter),
  ]);

  return { items, total, page, limit, pages: Math.ceil(total / limit) || 1 };
}

export async function getTask(id) {
  const task = await Task.findById(id);
  if (!task) throw ApiError.notFound('Task not found');
  return task;
}

export function createTask(data) {
  return Task.create(data);
}

export async function updateTask(id, data) {
  const task = await getTask(id);
  task.set(data);
  // Partial updates may change only one side of the time range.
  if (task.endAt && task.endAt < task.dueAt) {
    throw new ApiError(400, 'End time must be after start time');
  }
  return task.save();
}

export async function deleteTask(id) {
  const task = await Task.findByIdAndDelete(id);
  if (!task) throw ApiError.notFound('Task not found');
  return task;
}

// Weekly summary (Monday → Sunday) computed in the caller's time zone so a task
// at 11pm Sunday local time never slips into the next week.
export function weeklySummary(tz) {
  return Task.aggregate([
    {
      $group: {
        _id: {
          $dateTrunc: { date: '$dueAt', unit: 'week', startOfWeek: 'monday', timezone: tz },
        },
        total: { $sum: 1 },
        completed: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
      },
    },
    { $sort: { _id: -1 } },
    {
      $project: {
        _id: 0,
        weekStart: '$_id',
        weekEnd: { $dateAdd: { startDate: '$_id', unit: 'week', amount: 1, timezone: tz } },
        total: 1,
        completed: 1,
        open: { $subtract: ['$total', '$completed'] },
      },
    },
  ]);
}
