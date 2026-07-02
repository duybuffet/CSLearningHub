import { useProgressStore } from '@/store/progress-store-with-persist';
import type { ViewMode } from '@/store/progress-store-with-persist';

const OPTIONS: { mode: ViewMode; label: string; hint: string }[] = [
  { mode: 'deep', label: '📖 Deep', hint: 'Full chapter' },
  { mode: 'compact', label: '⚡ Compact', hint: 'Quick review' },
];

// Segmented control to switch reading depth. Choice is global + persisted.
export function ViewModeToggle() {
  const viewMode = useProgressStore((s) => s.viewMode);
  const setViewMode = useProgressStore((s) => s.setViewMode);

  return (
    <div className="inline-flex items-center gap-1 rounded-btn border border-border-subtle bg-bg-card p-1">
      {OPTIONS.map((opt) => {
        const active = viewMode === opt.mode;
        return (
          <button
            key={opt.mode}
            type="button"
            onClick={() => setViewMode(opt.mode)}
            title={opt.hint}
            className={
              'px-3 py-1.5 rounded-btn text-sm font-medium transition-colors ' +
              (active
                ? 'bg-accent-orange/20 text-accent-orange'
                : 'text-text-muted hover:text-text-secondary')
            }
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
