import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { getCurriculum, topicIdFor } from '@/lib/content-loader';
import { overallCompletion } from '@/lib/completion-progress-helpers';
import { useProgressStore } from '@/store/progress-store-with-persist';
import { ProgressBar } from '@/components/ui/progress-bar';
import type { CurriculumPhase } from '@/types/content-schema-types';

function PhaseSection({
  phase,
  defaultOpen,
}: {
  phase: CurriculumPhase;
  defaultOpen: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const progress = useProgressStore((s) => s.progress);

  return (
    <div className="mb-1">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-2 rounded-btn px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider text-text-muted transition-colors hover:text-text-secondary"
        aria-expanded={open}
      >
        <span className="text-base leading-none">{phase.icon}</span>
        <span className="flex-1 truncate">{phase.title}</span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          className={`shrink-0 transition-transform duration-200 ${open ? 'rotate-90' : ''}`}
          aria-hidden="true"
        >
          <path
            d="M4 2l4 4-4 4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <div className="mt-1 space-y-0.5">
          {phase.weeks.map((week) => (
            <div key={week.id}>
              <p className="px-3 py-1 text-xs font-medium text-text-muted/70">{week.title}</p>
              {week.topics.map((topic) => {
                const topicId = topicIdFor(phase.id, topic.slug);
                const isRead = progress[topicId]?.read ?? false;
                const available = !!topic.file;

                if (!available) {
                  return (
                    <div
                      key={topic.slug}
                      className="flex cursor-not-allowed items-center gap-2 rounded-btn px-3 py-1.5 text-sm text-text-muted/50"
                      title="Coming soon"
                    >
                      <span className="flex-1 truncate">{topic.title}</span>
                      <span className="text-xs opacity-50">soon</span>
                    </div>
                  );
                }

                return (
                  <NavLink
                    key={topic.slug}
                    to={`/phase/${phase.id}/${topic.slug}`}
                    className={({ isActive }) =>
                      [
                        'flex items-center gap-2 rounded-btn px-3 py-1.5 text-sm transition-colors',
                        isActive
                          ? 'border-l-2 border-accent-orange bg-accent-orange/10 pl-[10px] text-text-primary'
                          : 'text-text-secondary hover:bg-bg-panel hover:text-text-primary',
                      ].join(' ')
                    }
                  >
                    <span className="flex-1 truncate">{topic.title}</span>
                    {isRead && (
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                        className="shrink-0 text-accent-green"
                        aria-label="Read"
                      >
                        <path
                          d="M2 6l3 3 5-5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function SidebarNavigationTree() {
  const curriculum = getCurriculum();
  const progress = useProgressStore((s) => s.progress);
  const { pct, read, total } = overallCompletion(curriculum, progress);

  return (
    <nav className="flex h-full flex-col">
      {/* Logo / brand */}
      <div className="px-4 py-5">
        <span className="text-lg font-bold text-text-primary">CS Learning Hub</span>
      </div>

      {/* Phase tree — scrollable */}
      <div className="flex-1 overflow-y-auto px-2 pb-4">
        {curriculum.phases.map((phase, i) => (
          <PhaseSection key={phase.id} phase={phase} defaultOpen={i === 0} />
        ))}
      </div>

      {/* Overall progress footer */}
      <div className="border-t border-border-subtle px-4 py-4">
        <div className="mb-2 flex items-center justify-between text-xs text-text-muted">
          <span>Overall progress</span>
          <span>
            {read}/{total} topics
          </span>
        </div>
        <ProgressBar value={pct} />
        <p className="mt-1 text-right text-xs text-text-muted">{pct}%</p>
      </div>
    </nav>
  );
}
