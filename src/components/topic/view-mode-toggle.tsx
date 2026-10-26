import { useProgressStore } from '@/store/progress-store-with-persist';
import type { ViewMode } from '@/store/progress-store-with-persist';

const OPTIONS: { mode: ViewMode; label: string; hint: string }[] = [
  { mode: 'deep', label: 'Full chapter', hint: 'Every section, examples and diagrams' },
  { mode: 'compact', label: 'Quick review', hint: 'Intro, diagrams, notes and takeaways only' },
];

// Segmented control to switch reading depth. Choice is global + persisted.
export function ViewModeToggle() {
  const viewMode = useProgressStore((s) => s.viewMode);
  const setViewMode = useProgressStore((s) => s.setViewMode);

  return (
    <div role="group" aria-label="Reading mode" className="inline-flex rounded-btn bg-bg-panel p-0.5 font-sans">
      {OPTIONS.map((opt) => {
        const active = viewMode === opt.mode;
        return (
          <button
            key={opt.mode}
            type="button"
            aria-pressed={active}
            onClick={() => setViewMode(opt.mode)}
            title={opt.hint}
            className={
              'rounded-[5px] px-3.5 py-1.5 text-sm transition-colors duration-150 ' +
              (active
                ? 'bg-bg-card font-medium text-text-primary shadow-[0_1px_2px_rgb(0_0_0/0.08)]'
                : 'text-text-muted hover:text-text-primary')
            }
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
