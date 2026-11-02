import { SearchIcon } from './ui/Icons';

// Search box from the Figma header. Rendered as a link-like button on Home, a real input on Search.
export default function SearchField({ value, onChange, onClick, placeholder = 'Search for a task', autoFocus }) {
  const shared = 'flex w-full items-center rounded-md border border-line bg-white px-4 py-3 text-sm';

  if (onClick) {
    return (
      <button onClick={onClick} className={`${shared} justify-between text-muted hover:border-brand/50`}>
        {placeholder}
        <SearchIcon className="text-xl text-ink" />
      </button>
    );
  }

  return (
    <label className={`${shared} gap-2 focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/15`}>
      <input
        type="search"
        autoFocus={autoFocus}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Search tasks"
        className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-muted"
      />
      <SearchIcon className="text-xl text-ink" />
    </label>
  );
}
