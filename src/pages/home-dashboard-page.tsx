// Home dashboard page: site header, overall completion progress bar, and
// collapsible phase sections each containing a responsive topic card grid.
import { useProgressStore } from '@/store/progress-store-with-persist';
import { getCurriculum } from '@/lib/content-loader';
import { overallCompletion } from '@/lib/completion-progress-helpers';
import { ProgressBar } from '@/components/ui/progress-bar';
import { PhaseSectionCollapsible } from '@/components/home/phase-section-collapsible';

export function HomePage() {
  const progress = useProgressStore((s) => s.progress);
  const curriculum = getCurriculum();
  const { pct, read, total } = overallCompletion(curriculum, progress);

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Site header */}
        <header className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-text-primary mb-2">
            <span className="mr-3" aria-hidden="true">&#128187;</span>
            CS Learning Hub
          </h1>
          <p className="text-text-secondary text-lg mb-8">
            A structured path from computer fundamentals to system design.
          </p>

          {/* Overall progress */}
          <div className="bg-bg-card border border-border-subtle rounded-card p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-text-secondary uppercase tracking-wider">
                Overall Progress
              </span>
              <span className="text-sm font-mono text-text-muted">
                {read} / {total} topics completed
              </span>
            </div>
            <ProgressBar value={pct} className="h-3" />
            <p className="text-xs text-text-muted mt-2">{pct}% complete</p>
          </div>
        </header>

        {/* Phase sections */}
        <main>
          {curriculum.phases.map((phase) => (
            <PhaseSectionCollapsible key={phase.id} phase={phase} />
          ))}
        </main>
      </div>
    </div>
  );
}
