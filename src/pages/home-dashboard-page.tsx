// Home: the course as a book's table of contents, with a "continue reading" link
// and overall progress. Parts expand/collapse; the part you're in opens by default.
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProgressStore } from '@/store/progress-store-with-persist';
import { getCurriculum, numberedTopic } from '@/lib/content-loader';
import { overallCompletion } from '@/lib/completion-progress-helpers';
import { TableOfContentsPart } from '@/components/home/table-of-contents-part';
import { localizedTopicTitle } from '@/lib/translation-overlay';
import { useT } from '@/lib/ui-strings';

export function HomePage() {
  const progress = useProgressStore((s) => s.progress);
  const lastVisited = useProgressStore((s) => s.lastVisited);
  const curriculum = getCurriculum();
  const { pct, read, total } = overallCompletion(curriculum, progress);
  const { lang, t } = useT();

  // lastVisited is "<phaseId>_<slug>"; phase ids contain no underscore
  const [lastPhase, ...slugParts] = (lastVisited ?? '').split('_');
  const resume = lastVisited ? numberedTopic(lastPhase, slugParts.join('_')) : undefined;

  const [openParts, setOpenParts] = useState<Set<string>>(
    () => new Set([resume?.phaseId ?? curriculum.phases[0].id]),
  );
  const toggle = (id: string) =>
    setOpenParts((prev) => {
      const nextSet = new Set(prev);
      if (nextSet.has(id)) nextSet.delete(id);
      else nextSet.add(id);
      return nextSet;
    });
  const allOpen = openParts.size === curriculum.phases.length;

  return (
    <div className="mx-auto max-w-3xl pb-16">
      <header className="max-w-prose pb-10 pt-2 sm:pt-8">
        <h1 className="font-serif text-[38px] font-semibold leading-[1.08] tracking-[-0.02em] text-text-primary sm:text-[52px]">
          CS Learning Hub
        </h1>
        <p className="mt-4 font-serif text-[19px] leading-relaxed text-text-secondary sm:text-[21px]">
          {t('homeLede')}
        </p>

        <div className="mt-8 font-sans">
          <div className="h-[3px] w-full bg-border-subtle" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={t('chaptersRead', { read, total })}>
            <div className="h-full bg-accent transition-[width] duration-500" style={{ width: `${pct}%` }} />
          </div>
          <p className="mt-2 text-sm text-text-muted">
            {read === 0 ? t('chaptersInParts', { total, parts: curriculum.phases.length }) : t('chaptersRead', { read, total })}
          </p>
        </div>

        {resume && (
          <Link
            to={resume.href}
            className="group mt-6 flex items-baseline gap-3 rounded-btn border border-border-subtle bg-bg-card px-4 py-3.5 font-sans"
          >
            <span className="shrink-0 text-sm text-text-muted">{t('continue')}</span>
            <span className="min-w-0 flex-1 truncate text-[16px] text-text-primary group-hover:text-accent">
              {resume.number} {localizedTopicTitle(resume.file, resume.title, lang)}
            </span>
          </Link>
        )}
      </header>

      <div className="mb-2 flex items-baseline justify-between font-sans">
        <h2 className="text-[15px] font-semibold text-text-primary">{t('contents')}</h2>
        <button
          onClick={() => setOpenParts(allOpen ? new Set() : new Set(curriculum.phases.map((p) => p.id)))}
          className="text-sm text-text-muted hover:text-accent"
        >
          {allOpen ? t('collapseAll') : t('expandAll')}
        </button>
      </div>

      <div className="border-b border-border-subtle">
        {curriculum.phases.map((phase, i) => (
          <TableOfContentsPart
            key={phase.id}
            phase={phase}
            partNumber={i + 1}
            progress={progress}
            open={openParts.has(phase.id)}
            onToggle={() => toggle(phase.id)}
          />
        ))}
      </div>
    </div>
  );
}
