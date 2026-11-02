import * as service from '../services/task.service.js';

export const list = async (req, res) => {
  res.json(await service.listTasks(req.valid.query));
};

export const weeks = async (req, res) => {
  res.json({ items: await service.weeklySummary(req.valid.query.tz) });
};

export const getOne = async (req, res) => {
  res.json(await service.getTask(req.valid.params.id));
};

export const create = async (req, res) => {
  res.status(201).json(await service.createTask(req.valid.body));
};

export const update = async (req, res) => {
  res.json(await service.updateTask(req.valid.params.id, req.valid.body));
};

export const remove = async (req, res) => {
  await service.deleteTask(req.valid.params.id);
  res.status(204).end();
};
