import { useNavigate } from 'react-router-dom';

export const ONBOARDED_KEY = 'todo:onboarded';

const Zigzag = ({ className }) => (
  <svg viewBox="0 0 120 60" className={className} fill="none" stroke="currentColor" strokeWidth="5" aria-hidden="true">
    {[10, 28, 46].map((y) => (
      <path key={y} d={`M0 ${y} l15 -10 l15 10 l15 -10 l15 10 l15 -10 l15 10 l15 -10 l15 10`} />
    ))}
  </svg>
);

export default function Onboarding() {
  const navigate = useNavigate();

  const start = () => {
    try {
      localStorage.setItem(ONBOARDED_KEY, '1');
    } catch {
      /* storage unavailable: onboarding will just show again */
    }
    navigate('/', { replace: true });
  };

  return (
    <main className="flex min-h-dvh flex-col bg-white md:items-center md:justify-center md:bg-brand-tint">
      <div className="flex flex-1 flex-col md:w-full md:max-w-md md:flex-none md:overflow-hidden md:rounded-3xl md:bg-white md:shadow-xl">
        <div className="relative min-h-[55dvh] flex-1 overflow-hidden bg-brand md:min-h-[420px]">
          <div className="absolute -top-10 -right-10 size-28 rounded-full border-[14px] border-white/20" />
          <Zigzag className="absolute top-14 left-6 w-28 text-white/25" />
          <Zigzag className="absolute right-6 bottom-10 w-32 text-white/25" />
        </div>

        <div className="flex flex-col px-6 pt-8 pb-[max(2rem,env(safe-area-inset-bottom))]">
          <h1 className="text-2xl font-semibold">Manage What To Do</h1>
          <p className="mt-3 max-w-[260px] text-xs leading-relaxed text-muted">
            The best way to manage what you have to do, don&apos;t forget your plans
          </p>
          <button onClick={start} className="btn-primary mt-10">
            Get Started
          </button>
        </div>
      </div>
    </main>
  );
}
