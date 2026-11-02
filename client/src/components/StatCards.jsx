import { CheckSquareIcon, XSquareIcon } from './ui/Icons';

const pad = (n) => String(n).padStart(2, '0');

function StatCard({ icon, label, value, caption, className }) {
  return (
    <div className={`rounded-sm px-3 py-4 ${className}`}>
      <div className="flex items-center gap-2 text-xs font-medium text-ink">
        <span className="text-2xl">{icon}</span>
        {label}
      </div>
      <p className="mt-2 pl-1 text-center">
        <span className="text-2xl font-semibold text-ink">{pad(value)}</span>
        <span className="ml-1.5 text-[10px] text-muted">{caption}</span>
      </p>
    </div>
  );
}

export default function StatCards({ completed, open, caption }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <StatCard
        icon={<CheckSquareIcon className="text-brand" />}
        label="Task Complete"
        value={completed}
        caption={caption}
        className="bg-brand-tint"
      />
      <StatCard
        icon={<XSquareIcon className="text-danger" />}
        label="Task Pending"
        value={open}
        caption={caption}
        className="bg-danger-tint"
      />
    </div>
  );
}
