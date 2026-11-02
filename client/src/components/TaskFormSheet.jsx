import { useState } from 'react';
import BottomSheet from './ui/BottomSheet';
import { CalendarIcon, ClockIcon } from './ui/Icons';
import { useCreateTask, useUpdateTask } from '../hooks/useTasks';
import { combine, toDateInput, toTimeInput } from '../utils/date';
import { PRIORITIES, STATUS } from '../utils/task';

function initialForm(task, defaultDate) {
  if (task) {
    const start = new Date(task.dueAt);
    return {
      title: task.title,
      description: task.description || '',
      date: toDateInput(start),
      start: toTimeInput(start),
      end: task.endAt ? toTimeInput(new Date(task.endAt)) : '',
      priority: task.priority || null,
      status: task.status,
    };
  }
  // New task: chosen day at the next full hour.
  const now = new Date();
  const day = defaultDate ? new Date(defaultDate) : now;
  return {
    title: '',
    description: '',
    date: toDateInput(day),
    start: `${String((now.getHours() + 1) % 24).padStart(2, '0')}:00`,
    end: '',
    priority: null,
    status: STATUS.OPEN,
  };
}

function validate(f) {
  const errors = {};
  if (!f.title.trim()) errors.title = 'Please enter a task title';
  if (!f.date) errors.date = 'Please pick a date';
  if (!f.start) errors.start = 'Start time is required';
  if (f.end && f.start && f.end < f.start) errors.end = 'Ends before it starts';
  return errors;
}

export default function TaskFormSheet({ task, defaultDate, onClose }) {
  const isEdit = Boolean(task);
  const [form, setForm] = useState(() => initialForm(task, defaultDate));
  const [errors, setErrors] = useState({});
  const create = useCreateTask();
  const update = useUpdateTask();
  const mutation = isEdit ? update : create;

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((er) => ({ ...er, [key]: undefined }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length) return;

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      dueAt: combine(form.date, form.start).toISOString(),
      endAt: form.end ? combine(form.date, form.end).toISOString() : null,
      priority: form.priority,
      status: form.status,
    };
    mutation.mutate(isEdit ? { id: task.id, ...payload } : payload, { onSuccess: onClose });
  };

  return (
    <BottomSheet open title={isEdit ? 'Edit Task' : 'Add New Task'} onClose={onClose}>
      <form onSubmit={onSubmit} noValidate className="space-y-4">
        <Field label="Task title" error={errors.title}>
          <input
            autoFocus={!isEdit}
            className="field"
            placeholder="e.g. Doing Homework"
            value={form.title}
            onChange={set('title')}
            maxLength={120}
          />
        </Field>

        <div>
          <span className="label">Set Time</span>
          <div className="grid grid-cols-2 gap-3">
            <IconInput icon={<ClockIcon />} label="Start" error={errors.start}>
              <input type="time" className="field pl-9" value={form.start} onChange={set('start')} aria-label="Start time" />
            </IconInput>
            <IconInput icon={<ClockIcon />} label="Ends" error={errors.end}>
              <input type="time" className="field pl-9" value={form.end} onChange={set('end')} aria-label="End time" />
            </IconInput>
          </div>
        </div>

        <Field label="Set Date" error={errors.date}>
          <div className="relative">
            <input type="date" className="field pr-10" value={form.date} onChange={set('date')} />
            <CalendarIcon className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-muted" />
          </div>
        </Field>

        <div>
          <span className="label">Priority</span>
          <div className="grid grid-cols-3 gap-2">
            {PRIORITIES.map((p) => {
              const active = form.priority === p.value;
              return (
                <button
                  type="button"
                  key={p.value}
                  aria-pressed={active}
                  onClick={() => setForm((f) => ({ ...f, priority: active ? null : p.value }))}
                  className={`rounded-md border py-2.5 text-xs font-medium transition ${
                    active ? p.activeClass : 'border-line text-muted hover:border-brand/40'
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>

        <Field label="Description">
          <textarea
            rows={4}
            className="field resize-none"
            placeholder="Add Description"
            value={form.description}
            onChange={set('description')}
            maxLength={2000}
          />
        </Field>

        {isEdit && (
          <label className="flex items-center justify-between rounded-md border border-line px-3.5 py-3 text-sm">
            <span>Mark as completed</span>
            <input
              type="checkbox"
              className="size-4 accent-[var(--color-brand)]"
              checked={form.status === STATUS.DONE}
              onChange={(e) => setForm((f) => ({ ...f, status: e.target.checked ? STATUS.DONE : STATUS.OPEN }))}
            />
          </label>
        )}

        {mutation.error && <p className="text-sm text-danger">{mutation.error.message}</p>}

        <button type="submit" className="btn-primary" disabled={mutation.isPending}>
          {mutation.isPending ? 'Saving…' : isEdit ? 'Save changes' : 'Create task'}
        </button>
      </form>
    </BottomSheet>
  );
}

function Field({ label, error, children }) {
  return (
    <label className="block">
      <span className="label">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-danger">{error}</span>}
    </label>
  );
}

function IconInput({ icon, error, children }) {
  return (
    <div>
      <div className="relative">
        <span className="pointer-events-none absolute top-1/2 left-3 z-10 -translate-y-1/2 text-ink">{icon}</span>
        {children}
      </div>
      {error && <span className="mt-1 block text-xs text-danger">{error}</span>}
    </div>
  );
}
