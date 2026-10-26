import type {
  Curriculum,
  CurriculumTopic,
  Lang,
  TopicContent,
  TopicOverlay,
} from '@/types/content-schema-types';
import curriculumJson from '@/content/curriculum.json';
import { applyOverlay } from './translation-overlay';

// Lazy globs — each topic (and each translation overlay) becomes its own chunk,
// so the initial bundle stays small on mobile (the PWA service worker precaches
// them for offline reading). curriculum.json is imported statically above.
const topicModules = import.meta.glob<TopicContent>('../content/phase*/*.json', { import: 'default' });
const overlayModules: Partial<Record<Lang, Record<string, () => Promise<TopicOverlay>>>> = {
  vi: import.meta.glob<TopicOverlay>('../content/vi/phase*/*.json', { import: 'default' }),
};

const curriculum = curriculumJson as Curriculum;

export function getCurriculum(): Curriculum {
  return curriculum;
}

function findLoader<T>(modules: Record<string, () => Promise<T>> | undefined, file: string) {
  return modules && Object.entries(modules).find(([key]) => key.endsWith(`/${file}`))?.[1];
}

export interface LoadedTopic {
  topic: TopicContent;
  /** false when the requested language isn't available and English is shown */
  translated: boolean;
}

/** Resolve a topic by its curriculum `file` path (e.g. "phase1/x.json"), in `lang` when translated. */
export async function loadTopicByFile(file: string, lang: Lang = 'en'): Promise<LoadedTopic | null> {
  const loader = findLoader(topicModules, file);
  if (!loader) return null;
  const topic = await loader();
  if (lang === 'en') return { topic, translated: true };

  const overlayLoader = findLoader(overlayModules[lang], file);
  const localized = overlayLoader ? applyOverlay(topic, await overlayLoader()) : null;
  return localized ? { topic: localized, translated: true } : { topic, translated: false };
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
  file: string;
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
      file: t.file!,
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
