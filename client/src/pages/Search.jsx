import { useNavigate, useSearchParams } from 'react-router-dom';
import SearchField from '../components/SearchField';
import TaskList from '../components/TaskList';
import { BackIcon } from '../components/ui/Icons';
import { useTasks } from '../hooks/useTasks';
import useDebounce from '../hooks/useDebounce';

export default function Search() {
  const navigate = useNavigate();
  // Query lives in the URL so results survive refresh and are shareable.
  const [params, setParams] = useSearchParams();
  const q = params.get('q') ?? '';
  const term = useDebounce(q.trim(), 250);

  const { data, isFetching, error } = useTasks({ search: term, limit: 100 }, { enabled: term.length > 0 });

  return (
    <main className="mx-auto min-h-dvh w-full max-w-md px-5 pt-6 pb-10 md:max-w-2xl">
      <button onClick={() => navigate(-1)} aria-label="Back" className="-ml-1 mb-5 p-1 text-2xl hover:text-brand">
        <BackIcon />
      </button>

      <SearchField
        autoFocus
        value={q}
        placeholder="Search by title or description"
        onChange={(v) => setParams(v ? { q: v } : {}, { replace: true })}
      />

      <div className="mt-4">
        {!term ? (
          <p className="py-10 text-center text-sm text-muted">Start typing to find a task</p>
        ) : (
          <>
            <p className="mb-1 text-xs text-muted">
              {isFetching ? 'Searching…' : `${data?.total ?? 0} result${data?.total === 1 ? '' : 's'}`}
            </p>
            <TaskList
              tasks={data?.items}
              loading={isFetching && !data}
              error={error}
              showDate
              empty={`No tasks match “${term}”`}
            />
          </>
        )}
      </div>
    </main>
  );
}
