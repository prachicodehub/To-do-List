import { http } from './http';

const TZ = Intl.DateTimeFormat().resolvedOptions().timeZone;

export const tasksApi = {
  list: (params) => http('/tasks', { params }),
  weeks: () => http('/tasks/weeks', { params: { tz: TZ } }),
  get: (id) => http(`/tasks/${id}`),
  create: (body) => http('/tasks', { method: 'POST', body }),
  update: (id, body) => http(`/tasks/${id}`, { method: 'PATCH', body }),
  setStatus: (id, status) => http(`/tasks/${id}/status`, { method: 'PATCH', body: { status } }),
  remove: (id) => http(`/tasks/${id}`, { method: 'DELETE' }),
};
