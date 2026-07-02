import type {
  Curriculum,
  CurriculumTopic,
  TopicContent,
} from '@/types/content-schema-types';
import curriculumJson from '@/content/curriculum.json';

// Eager glob of all topic JSON under content/. Keyed by path like
// "/src/content/phase1/week1-....json" (Vite normalizes to absolute-from-root).
const topicModules = import.meta.glob<TopicContent>('../content/**/*.json', {
  eager: true,
  import: 'default',
});

const curriculum = curriculumJson as Curriculum;

export function getCurriculum(): Curriculum {
  return curriculum;
}

/** Resolve a topic's JSON by its curriculum `file` path (e.g. "phase1/week1-x.json"). */
export function loadTopicByFile(file: string): TopicContent | null {
  const match = Object.entries(topicModules).find(([key]) =>
    key.endsWith(`/${file}`),
  );
  return match ? (match[1] as TopicContent) : null;
}

/** Find a topic entry in the curriculum tree by phase id + slug. */
export function findTopicEntry(
  phaseId: string,
  slug: string,
): { topic: CurriculumTopic; phaseIndex: number } | null {
  const phaseIndex = curriculum.phases.findIndex((p) => p.id === phaseId);
  if (phaseIndex === -1) return null;
  for (const week of curriculum.phases[phaseIndex].weeks) {
    const topic = week.topics.find((t) => t.slug === slug);
    if (topic) return { topic, phaseIndex };
  }
  return null;
}

/** Flat ordered list of all topics that have generated content (for next/prev nav). */
export function flatTopicList(): { phaseId: string; slug: string; title: string; file?: string }[] {
  const out: { phaseId: string; slug: string; title: string; file?: string }[] = [];
  for (const phase of curriculum.phases) {
    for (const week of phase.weeks) {
      for (const t of week.topics) {
        out.push({ phaseId: phase.id, slug: t.slug, title: t.title, file: t.file });
      }
    }
  }
  return out;
}

/** Topic id built from phase+slug, matching content JSON `id` convention. */
export function topicIdFor(phaseId: string, slug: string): string {
  return `${phaseId}_${slug}`;
}
