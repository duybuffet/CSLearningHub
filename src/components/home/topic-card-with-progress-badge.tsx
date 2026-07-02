// Topic card showing icon, title, completion badge, and "Open →" link.
// Disabled "Coming soon" state when topic.file is undefined.
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { CurriculumTopic } from '@/types/content-schema-types';
import { useProgressStore } from '@/store/progress-store-with-persist';
import { topicIdFor } from '@/lib/content-loader';
import { TopicCardIcon } from './topic-card-icon';
import { CompletionBadge } from '@/components/ui/completion-badge';
import { ProgressBar } from '@/components/ui/progress-bar';

interface TopicCardProps {
  phaseId: string;
  topic: CurriculumTopic;
}

function getIconForSlug(slug: string): string {
  if (slug.includes('binary') || slug.includes('number') || slug.includes('character')) return 'binary';
  if (slug.includes('logic') || slug.includes('boolean')) return 'logic-gate';
  if (slug.includes('cpu') || slug.includes('fetch')) return 'cpu';
  if (slug.includes('memory') || slug.includes('heap') || slug.includes('stack')) return 'memory';
  if (slug.includes('sort')) return 'sort';
  if (slug.includes('graph') || slug.includes('tree') || slug.includes('hash') || slug.includes('array') || slug.includes('queue')) return 'stack';
  if (slug.includes('network')) return 'network';
  if (slug.includes('database') || slug.includes('sql') || slug.includes('acid')) return 'database';
  if (slug.includes('architecture') || slug.includes('scalab')) return 'architecture';
  if (slug.includes('pattern') || slug.includes('creational') || slug.includes('behavioral')) return 'pattern';
  if (slug.includes('os') || slug.includes('operating') || slug.includes('program')) return 'os';
  if (slug.includes('solid') || slug.includes('testing') || slug.includes('cicd') || slug.includes('clean')) return 'gear';
  if (slug.includes('recursion') || slug.includes('big-o') || slug.includes('dynamic')) return 'code';
  return 'code';
}

export function TopicCard({ phaseId, topic }: TopicCardProps) {
  const progress = useProgressStore((s) => s.progress);
  const topicId = topicIdFor(phaseId, topic.slug);
  const topicProgress = progress[topicId];
  const isAvailable = Boolean(topic.file);
  const iconKey = getIconForSlug(topic.slug);

  const cardBase =
    'relative flex flex-col gap-3 p-5 rounded-card border border-border-subtle bg-bg-card transition-all duration-200';

  if (!isAvailable) {
    return (
      <div className={`${cardBase} opacity-50 cursor-not-allowed`}>
        <TopicCardIcon icon={iconKey} className="opacity-50" />
        <div>
          <p className="text-sm font-semibold text-text-muted leading-snug">{topic.title}</p>
          <p className="text-xs text-text-muted mt-1">Coming soon</p>
        </div>
        <span className="absolute top-3 right-3 text-xs text-text-muted border border-border-subtle rounded px-2 py-0.5">
          Soon
        </span>
      </div>
    );
  }

  const quizScore = topicProgress?.quizScore;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="group"
    >
      <Link
        to={`/phase/${phaseId}/${topic.slug}`}
        className={`${cardBase} group-hover:bg-bg-panel group-hover:border-accent-blue/40 group-hover:shadow-[0_0_16px_rgba(96,165,250,0.12)] no-underline block`}
      >
        {/* Completion badge top-right */}
        <span className="absolute top-3 right-3">
          <CompletionBadge read={topicProgress?.read ?? false} score={quizScore} />
        </span>

        <TopicCardIcon icon={iconKey} />

        <div className="flex-1">
          <p className="text-sm font-semibold text-text-primary leading-snug pr-8">{topic.title}</p>
        </div>

        {/* Progress bar if quiz attempted */}
        {quizScore !== undefined && (
          <ProgressBar value={quizScore} className="mt-1" />
        )}

        <div className="flex items-center justify-between mt-auto">
          <span className="text-xs text-text-muted">
            {topicProgress?.read ? 'Read' : 'Not started'}
          </span>
          <span className="text-xs font-mono text-accent-blue group-hover:translate-x-0.5 transition-transform duration-150">
            Open →
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
