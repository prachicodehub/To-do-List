// Local-time date helpers. Weeks run Monday → Sunday.

export const DAY_MS = 86_400_000;

export function startOfDay(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

export function addDays(d, n) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

export function startOfWeek(d) {
  const x = startOfDay(d);
  const offset = (x.getDay() + 6) % 7; // Monday = 0
  return addDays(x, -offset);
}

export const weekDays = (weekStart) => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

export const isSameDay = (a, b) => startOfDay(a).getTime() === startOfDay(b).getTime();

const fmt = (opts) => new Intl.DateTimeFormat(undefined, opts);
const timeFmt = fmt({ hour: 'numeric', minute: '2-digit' });
const shortDate = fmt({ day: 'numeric', month: 'short' });

export const formatTime = (d) => timeFmt.format(new Date(d));
export const formatWeekday = (d) => fmt({ weekday: 'short' }).format(d);
export const formatLongDate = (d) => fmt({ weekday: 'long', day: 'numeric', month: 'long' }).format(d);

export function formatWeekRange(start) {
  const end = addDays(start, 6);
  return `${shortDate.format(start)} – ${shortDate.format(end)}`;
}

export function weekLabel(start) {
  const diff = Math.round((startOfWeek(start) - startOfWeek(new Date())) / (7 * DAY_MS));
  if (diff === 0) return 'This Week';
  if (diff === -1) return 'Last Week';
  if (diff === 1) return 'Next Week';
  return formatWeekRange(start);
}

export function dayLabel(d) {
  const today = new Date();
  if (isSameDay(d, today)) return 'Tasks Today';
  if (isSameDay(d, addDays(today, 1))) return 'Tasks Tomorrow';
  if (isSameDay(d, addDays(today, -1))) return 'Tasks Yesterday';
  return fmt({ weekday: 'long', day: 'numeric', month: 'short' }).format(d);
}

// <input type="date|time"> ⇄ Date
const pad = (n) => String(n).padStart(2, '0');
export const toDateInput = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const toTimeInput = (d) => `${pad(d.getHours())}:${pad(d.getMinutes())}`;
export const combine = (date, time) => (date && time ? new Date(`${date}T${time}`) : null);
