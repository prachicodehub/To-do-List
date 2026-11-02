import { ChevronIcon } from './ui/Icons';
import { formatWeekday, isSameDay, weekDays, addDays, weekLabel } from '../utils/date';

// Mon–Sun day picker for one week, with arrows to move between weeks.
export default function WeekStrip({ weekStart, selected, onSelect, busyDays }) {
  const days = weekDays(weekStart);
  const today = new Date();

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-xs text-muted">
        <button aria-label="Previous week" className="p-1 hover:text-brand" onClick={() => onSelect(addDays(selected, -7))}>
          <ChevronIcon className="rotate-180" />
        </button>
        <span className="font-medium">{weekLabel(weekStart)}</span>
        <button aria-label="Next week" className="p-1 hover:text-brand" onClick={() => onSelect(addDays(selected, 7))}>
          <ChevronIcon />
        </button>
      </div>

      <ol className="grid grid-cols-7 gap-1 text-center">
        {days.map((d) => {
          const active = isSameDay(d, selected);
          const hasTasks = busyDays.has(d.toDateString());
          return (
            <li key={d.toISOString()}>
              <button
                onClick={() => onSelect(d)}
                aria-pressed={active}
                aria-label={d.toDateString()}
                className={`flex w-full flex-col items-center rounded-[3px] py-2 transition ${
                  active ? 'bg-brand text-white shadow-md shadow-brand/30' : 'text-muted hover:bg-brand-tint'
                }`}
              >
                <span className="text-[10px]">{formatWeekday(d)}</span>
                <span className={`mt-1 text-base ${isSameDay(d, today) && !active ? 'font-semibold text-brand' : ''}`}>
                  {String(d.getDate()).padStart(2, '0')}
                </span>
                <span className={`mt-1 size-1 rounded-full ${hasTasks ? (active ? 'bg-white' : 'bg-brand') : 'bg-transparent'}`} />
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
