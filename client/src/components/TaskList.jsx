import TaskItem from './TaskItem';

export default function TaskList({ tasks, loading, error, empty = 'No tasks yet', showDate }) {
  if (error) return <p className="py-6 text-center text-sm text-danger">{error.message}</p>;
  if (loading)
    return (
      <ul className="space-y-3 py-2" aria-busy="true">
        {[0, 1, 2].map((i) => (
          <li key={i} className="h-10 animate-pulse rounded-md bg-line/60" />
        ))}
      </ul>
    );
  if (!tasks?.length) return <p className="py-6 text-center text-sm text-muted">{empty}</p>;

  return (
    <ul>
      {tasks.map((t) => (
        <TaskItem key={t.id} task={t} showDate={showDate} />
      ))}
    </ul>
  );
}
