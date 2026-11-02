import { useState } from 'react';
import TaskList from './TaskList';
import { ChevronIcon } from './ui/Icons';
import { useTasks } from '../hooks/useTasks';
import { formatWeekRange, weekLabel } from '../utils/date';

// Summary card for one Mon–Sun week; expands to list that week's tasks.
export default function WeekCard({ week, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  const start = new Date(week.weekStart);
  const pct = week.total ? (week.completed / week.total) * 100 : 0;

  const { data, isLoading, error } = useTasks(
    { from: week.weekStart, to: week.weekEnd, limit: 200 },
    { enabled: open },
  );

  return (
    <article className="overflow-hidden rounded-lg border border-line bg-white">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition hover:bg-brand-tint/50"
      >
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">{weekLabel(start)}</p>
          <p className="text-[11px] text-muted">{formatWeekRange(start)}</p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-brand-soft">
            <div className="h-full bg-brand-dark" style={{ width: `${pct}%` }} />
          </div>
        </div>
        <div className="flex gap-2 text-center text-[10px] text-muted">
          <span className="rounded-md bg-danger-tint px-2.5 py-1.5">
            <b className="block text-base font-semibold text-danger">{week.open}</b>Open
          </span>
          <span className="rounded-md bg-brand-tint px-2.5 py-1.5">
            <b className="block text-base font-semibold text-brand">{week.completed}</b>Done
          </span>
        </div>
        <ChevronIcon className={`text-muted transition-transform ${open ? 'rotate-90' : ''}`} />
      </button>

      {open && (
        <div className="border-t border-line px-4">
          <TaskList tasks={data?.items} loading={isLoading} error={error} showDate empty="No tasks this week" />
        </div>
      )}
    </article>
  );
}
