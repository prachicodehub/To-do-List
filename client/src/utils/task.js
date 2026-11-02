export const STATUS = { OPEN: 'in-progress', DONE: 'completed' };

export const PRIORITIES = [
  { value: 'low', label: 'Low', activeClass: 'border-emerald-500 bg-emerald-50 text-emerald-700', dot: 'bg-emerald-500' },
  { value: 'medium', label: 'Medium', activeClass: 'border-amber-500 bg-amber-50 text-amber-700', dot: 'bg-amber-500' },
  { value: 'high', label: 'High', activeClass: 'border-danger bg-danger-tint text-danger', dot: 'bg-danger' },
];

export const priorityMeta = (value) => PRIORITIES.find((p) => p.value === value);

export const isDone = (task) => task.status === STATUS.DONE;
