import { Link } from 'react-router-dom';
import type { CurriculumPhase, TopicProgress } from '@/types/content-schema-types';
import { topicIdFor, topicsInPhase } from '@/lib/content-loader';
import { localizedPhaseTitle, localizedTopicTitle } from '@/lib/translation-overlay';
import { useT } from '@/lib/ui-strings';

interface TableOfContentsPartProps {
  phase: CurriculumPhase;
  partNumber: number;
  progress: Record<string, TopicProgress>;
  open: boolean;
  onToggle: () => void;
}

// One "part" of the book: numbered heading with read count, chapters listed beneath.
// Chapters you've read get a highlighter stroke, like a marked-up textbook.
export function TableOfContentsPart({ phase, partNumber, progress, open, onToggle }: TableOfContentsPartProps) {
  const chapters = topicsInPhase(phase.id);
  const readCount = chapters.filter((c) => progress[topicIdFor(c.phaseId, c.slug)]?.read).length;
  const listId = `part-${phase.id}`;
  const { lang, t } = useT();

  return (
    <section className="border-t border-border-subtle">
      <button
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={listId}
        className="group flex w-full items-baseline gap-4 py-4 text-left"
      >
        <span className="w-7 shrink-0 font-serif text-[20px] leading-none text-text-muted sm:text-[22px]">{partNumber}</span>
        <span className="min-w-0 flex-1 font-serif text-[19px] leading-tight text-text-primary sm:text-[21px] group-hover:text-accent">
          {localizedPhaseTitle(phase.id, phase.title, lang)}
        </span>
        <span className="shrink-0 font-sans text-sm tabular-nums text-text-muted">
          {readCount > 0 ? t('partRead', { read: readCount, n: chapters.length }) : t('partChapters', { n: chapters.length })}
        </span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          className={`shrink-0 self-center text-text-muted transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        >
          <path d="M3 5l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <ol id={listId} hidden={!open} className="pb-4">
          {chapters.map((c) => {
            const p = progress[topicIdFor(c.phaseId, c.slug)];
            return (
              <li key={c.slug}>
                <Link to={c.href} className="group flex items-baseline gap-4 py-2 pl-11 pr-1">
                  <span className="w-9 shrink-0 font-sans text-sm tabular-nums text-text-muted">{c.number}</span>
                  <span className="min-w-0 flex-1 font-sans text-[16px] leading-snug text-text-primary group-hover:text-accent">
                    <span
                      className={
                        p?.read
                          ? 'bg-[linear-gradient(transparent_58%,rgb(var(--marker)/0.55)_58%)] [box-decoration-break:clone]'
                          : undefined
                      }
                    >
                      {localizedTopicTitle(c.file, c.title, lang)}
                    </span>
                  </span>
                  {p?.quizScore !== undefined && (
                    <span className="shrink-0 font-sans text-xs tabular-nums text-text-muted" title={t('bestQuizScore')}>
                      {p.quizScore}%
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
      </ol>
    </section>
  );
}
