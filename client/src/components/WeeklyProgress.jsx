export default function WeeklyProgress({ completed, total }) {
  const pct = total ? Math.round((completed / total) * 100) : 0;
  return (
    <section>
      <div className="mb-3 flex items-baseline justify-between">
        <h2 className="text-base font-semibold">Weekly Progress</h2>
        <span className="text-xs text-muted">{pct}%</span>
      </div>
      <div
        className="h-5 w-full overflow-hidden bg-brand-soft"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className="h-full bg-brand-dark transition-[width] duration-500" style={{ width: `${pct}%` }} />
      </div>
    </section>
  );
}
