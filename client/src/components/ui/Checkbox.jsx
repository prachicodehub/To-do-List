import { CheckIcon } from './Icons';

export default function Checkbox({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`grid size-5 shrink-0 place-items-center rounded-[3px] border-[1.5px] text-sm transition ${
        checked ? 'border-brand bg-brand-tint text-brand' : 'border-brand text-transparent hover:bg-brand-tint'
      }`}
    >
      <CheckIcon strokeWidth="2.4" />
    </button>
  );
}
