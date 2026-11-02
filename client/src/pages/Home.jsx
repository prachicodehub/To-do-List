import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchField from '../components/SearchField';
import WeekStrip from '../components/WeekStrip';
import StatCards from '../components/StatCards';
import WeeklyProgress from '../components/WeeklyProgress';
import TaskList from '../components/TaskList';
import WeekCard from '../components/WeekCard';
import { PlusIcon } from '../components/ui/Icons';
import { useTasks, useWeeks } from '../hooks/useTasks';
import { useTaskSheet } from '../context/TaskSheetContext';
import { addDays, dayLabel, isSameDay, startOfDay, startOfWeek, weekLabel } from '../utils/date';
import { isDone } from '../utils/task';

export default function Home() {
  const navigate = useNavigate();
  const { openCreate } = useTaskSheet();
  const [selected, setSelected] = useState(() => startOfDay(new Date()));
  const [showWeek, setShowWeek] = useState(false);

  const weekStart = startOfWeek(selected);
  const range = { from: weekStart.toISOString(), to: addDays(weekStart, 7).toISOString(), limit: 200 };
  const { data, isLoading, error } = useTasks(range);
  const weeks = useWeeks();

  const { dayTasks, busyDays, completed, open } = useMemo(() => {
    const items = data?.items ?? [];
    const done = items.filter(isDone).length;
    return {
      dayTasks: items.filter((t) => isSameDay(t.dueAt, selected)),
      busyDays: new Set(items.map((t) => new Date(t.dueAt).toDateString())),
      completed: done,
      open: items.length - done,
    };
  }, [data, selected]);

  const listTitle = showWeek ? `All Tasks · ${weekLabel(weekStart)}` : dayLabel(selected);

  return (
    <main className="mx-auto min-h-dvh w-full max-w-md px-5 pt-6 pb-32 md:max-w-5xl md:px-8">
      <div className="md:grid md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-10">
        {/* Left column on desktop: overview */}
        <div className="space-y-6">
          <SearchField onClick={() => navigate('/search')} />
          <WeekStrip weekStart={weekStart} selected={selected} onSelect={setSelected} busyDays={busyDays} />
          <StatCards completed={completed} open={open} caption={weekLabel(weekStart)} />
          <WeeklyProgress completed={completed} total={completed + open} />
        </div>

        {/* Right column on desktop: tasks + weekly cards */}
        <div className="mt-8 space-y-8 md:mt-0">
          <section>
            <div className="mb-1 flex items-center justify-between">
              <h2 className="text-base font-semibold">{listTitle}</h2>
              <button onClick={() => setShowWeek((v) => !v)} className="text-xs font-medium text-brand hover:underline">
                {showWeek ? 'Show Day' : 'View All'}
              </button>
            </div>
            <TaskList
              tasks={showWeek ? data?.items : dayTasks}
              loading={isLoading}
              error={error}
              showDate={showWeek}
              empty={showWeek ? 'Nothing planned this week' : 'No tasks for this day — tap + to add one'}
            />
          </section>

          <section>
            <h2 className="mb-3 text-base font-semibold">All Weeks</h2>
            {weeks.isLoading ? (
              <div className="h-20 animate-pulse rounded-lg bg-line/60" />
            ) : weeks.data?.items.length ? (
              <div className="space-y-3">
                {weeks.data.items.map((w) => (
                  <WeekCard key={w.weekStart} week={w} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted">Your weekly summaries will show up here.</p>
            )}
          </section>
        </div>
      </div>

      <button
        onClick={() => openCreate(selected)}
        aria-label="Add task"
        className="fixed bottom-[max(1.5rem,env(safe-area-inset-bottom))] left-1/2 z-40 grid size-16 -translate-x-1/2 place-items-center rounded-full bg-brand text-3xl text-white shadow-lg shadow-brand/40 transition hover:bg-brand-dark active:scale-95"
      >
        <PlusIcon strokeWidth="1.5" />
      </button>
    </main>
  );
}
