import { useState } from 'react';
import { Link, NavLink, useParams } from 'react-router-dom';
import { getCurriculum, topicIdFor, topicsInPhase } from '@/lib/content-loader';
import { overallCompletion } from '@/lib/completion-progress-helpers';
import { useProgressStore } from '@/store/progress-store-with-persist';
import type { CurriculumPhase } from '@/types/content-schema-types';

function PartSection({ phase, partNumber, defaultOpen }: { phase: CurriculumPhase; partNumber: number; defaultOpen: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const progress = useProgressStore((s) => s.progress);

  return (
    <div>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-baseline gap-2.5 rounded-btn px-3 py-2 text-left text-[14px] text-text-primary hover:bg-bg-panel"
        aria-expanded={open}
      >
        <span className="w-5 shrink-0 font-serif text-[15px] text-text-muted">{partNumber}</span>
        <span className="flex-1 truncate font-medium" title={phase.title}>
          {phase.title}
        </span>
      </button>

      {open && (
        <ol className="mb-2 mt-0.5">
          {topicsInPhase(phase.id).map((c) => {
            const isRead = progress[topicIdFor(c.phaseId, c.slug)]?.read ?? false;
            return (
              <li key={c.slug}>
                <NavLink
                  to={c.href}
                  className={({ isActive }) =>
                    [
                      'flex items-baseline gap-2.5 border-l-2 py-1.5 pl-[38px] pr-3 text-[13.5px] leading-snug',
                      isActive
                        ? 'border-accent bg-accent/[0.07] text-accent'
                        : 'border-transparent text-text-secondary hover:text-text-primary',
                    ].join(' ')
                  }
                >
                  <span className="w-7 shrink-0 tabular-nums text-text-muted">{c.number}</span>
                  <span className="flex-1 truncate" title={c.title}>
                    {c.title}
                  </span>
                  {isRead && <span className="h-1.5 w-1.5 shrink-0 self-center rounded-full bg-marker" aria-label="Read" />}
                </NavLink>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}

export function SidebarNavigationTree() {
  const curriculum = getCurriculum();
  const progress = useProgressStore((s) => s.progress);
  const { pct, read, total } = overallCompletion(curriculum, progress);
  // Expand the part being read (fallback: first part on the home page)
  const { phaseId } = useParams<{ phaseId?: string }>();

  return (
    <nav className="flex h-full flex-col font-sans" aria-label="Contents">
      <div className="px-5 pb-4 pr-12 pt-5">
        <Link to="/" className="font-serif text-[19px] font-semibold text-text-primary hover:text-accent">
          CS Learning Hub
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto overscroll-contain px-2 pb-4">
        {curriculum.phases.map((phase, i) => (
          <PartSection
            key={phase.id}
            phase={phase}
            partNumber={i + 1}
            defaultOpen={phaseId ? phase.id === phaseId : i === 0}
          />
        ))}
      </div>

      <div className="border-t border-border-subtle px-5 py-4">
        <div className="h-[3px] w-full bg-border-subtle" aria-hidden="true">
          <div className="h-full bg-accent" style={{ width: `${pct}%` }} />
        </div>
        <p className="mt-2 text-xs text-text-muted">
          {read} of {total} chapters read
        </p>
      </div>
    </nav>
  );
}
