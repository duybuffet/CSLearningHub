import type { Curriculum, TopicProgress } from '@/types/content-schema-types';
import { topicIdFor } from './content-loader';

type ProgressMap = Record<string, TopicProgress>;

// Progress key convention: `${phaseId}_${slug}` (route-derived, stable).

/** Count of topics in a phase that have generated content (file present). */
function phaseTopicIds(curriculum: Curriculum, phaseId: string): string[] {
  const phase = curriculum.phases.find((p) => p.id === phaseId);
  if (!phase) return [];
  const ids: string[] = [];
  for (const week of phase.weeks) {
    for (const t of week.topics) {
      if (t.file) ids.push(topicIdFor(phaseId, t.slug));
    }
  }
  return ids;
}

/** Percent of a phase's available topics marked read (0-100). */
export function phaseCompletionPct(
  curriculum: Curriculum,
  progress: ProgressMap,
  phaseId: string,
): number {
  const ids = phaseTopicIds(curriculum, phaseId);
  if (ids.length === 0) return 0;
  const read = ids.filter((id) => progress[id]?.read).length;
  return Math.round((read / ids.length) * 100);
}

/** Overall percent across all available topics + total available count. */
export function overallCompletion(
  curriculum: Curriculum,
  progress: ProgressMap,
): { pct: number; read: number; total: number } {
  const all = curriculum.phases.flatMap((p) => phaseTopicIds(curriculum, p.id));
  const read = all.filter((id) => progress[id]?.read).length;
  const total = all.length;
  return { pct: total ? Math.round((read / total) * 100) : 0, read, total };
}
