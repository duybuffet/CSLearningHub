import type {
  Curriculum,
  CurriculumTopic,
  TopicContent,
} from '@/types/content-schema-types';
import curriculumJson from '@/content/curriculum.json';

// Lazy glob of all topic JSON under content/ — each topic becomes its own chunk,
// so the initial bundle stays small on mobile (the PWA service worker precaches
// them for offline reading). curriculum.json is imported statically above.
const topicModules = import.meta.glob<TopicContent>(
  ['../content/**/*.json', '!../content/curriculum.json'],
  { import: 'default' },
);

const curriculum = curriculumJson as Curriculum;

export function getCurriculum(): Curriculum {
  return curriculum;
}

/** Resolve a topic's JSON by its curriculum `file` path (e.g. "phase1/week1-x.json"). */
export async function loadTopicByFile(file: string): Promise<TopicContent | null> {
  const loader = Object.entries(topicModules).find(([key]) => key.endsWith(`/${file}`))?.[1];
  return loader ? loader() : null;
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

/** Topic id built from phase+slug, matching content JSON `id` convention. */
export function topicIdFor(phaseId: string, slug: string): string {
  return `${phaseId}_${slug}`;
}

export interface NumberedTopic {
  phaseId: string;
  slug: string;
  title: string;
  /** book-style chapter number, e.g. "3.6" = phase 3, sixth topic */
  number: string;
  href: string;
}

// Curriculum read as a book: phases are parts, topics are numbered chapters.
const numberedTopics: NumberedTopic[] = curriculum.phases.flatMap((phase, p) =>
  phase.weeks
    .flatMap((w) => w.topics)
    .filter((t) => t.file)
    .map((t, i) => ({
      phaseId: phase.id,
      slug: t.slug,
      title: t.title,
      number: `${p + 1}.${i + 1}`,
      href: `/phase/${phase.id}/${t.slug}`,
    })),
);

export function topicsInPhase(phaseId: string): NumberedTopic[] {
  return numberedTopics.filter((t) => t.phaseId === phaseId);
}

export function numberedTopic(phaseId: string, slug: string): NumberedTopic | undefined {
  return numberedTopics.find((t) => t.phaseId === phaseId && t.slug === slug);
}

/** Previous / next chapter across the whole course (crosses phase boundaries). */
export function adjacentTopics(phaseId: string, slug: string): { prev?: NumberedTopic; next?: NumberedTopic } {
  const i = numberedTopics.findIndex((t) => t.phaseId === phaseId && t.slug === slug);
  if (i === -1) return {};
  return { prev: numberedTopics[i - 1], next: numberedTopics[i + 1] };
}
