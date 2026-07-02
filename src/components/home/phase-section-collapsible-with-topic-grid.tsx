// Collapsible phase section: header with phase title + completion progress bar + toggle,
// body is a responsive 1→2→4 col grid of TopicCards for all topics across the phase's weeks.
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CurriculumPhase } from '@/types/content-schema-types';
import { useProgressStore } from '@/store/progress-store-with-persist';
import { getCurriculum } from '@/lib/content-loader';
import { phaseCompletionPct } from '@/lib/completion-progress-helpers';
import { ProgressBar } from '@/components/ui/progress-bar';
import { TopicCard } from './topic-card';

interface PhaseSectionCollapsibleProps {
  phase: CurriculumPhase;
}

export function PhaseSectionCollapsible({ phase }: PhaseSectionCollapsibleProps) {
  const [open, setOpen] = useState(true);
  const progress = useProgressStore((s) => s.progress);
  const curriculum = getCurriculum();
  const pct = phaseCompletionPct(curriculum, progress, phase.id);

  // Flatten weeks → topics
  const allTopics = phase.weeks.flatMap((week) => week.topics);

  return (
    <section className="mb-10">
      {/* Header row */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="w-full flex items-center gap-4 mb-4 group focus:outline-none"
        aria-expanded={open}
      >
        {/* Phase title */}
        <h2 className="text-lg font-bold text-text-primary whitespace-nowrap flex-shrink-0 group-hover:text-accent-blue transition-colors duration-150">
          {phase.title}
        </h2>

        {/* Progress bar fills remaining width */}
        <div className="flex-1 min-w-0">
          <ProgressBar value={pct} />
        </div>

        {/* Pct label */}
        <span className="text-sm text-text-muted flex-shrink-0 font-mono w-10 text-right">
          {pct}%
        </span>

        {/* Collapse chevron */}
        <motion.span
          animate={{ rotate: open ? 0 : -90 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0 text-text-muted group-hover:text-text-secondary transition-colors duration-150"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M4 6.5L9 11.5L14 6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.span>
      </button>

      {/* Collapsible body */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="body"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-1">
              {allTopics.map((topic) => (
                <TopicCard key={topic.slug} phaseId={phase.id} topic={topic} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
