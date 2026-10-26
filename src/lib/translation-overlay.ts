import type {
  CurriculumTitleOverlay,
  Lang,
  TopicContent,
  TopicOverlay,
} from '@/types/content-schema-types';
import viTitles from '@/content/vi/curriculum-titles.json';

// Contents-page titles per language (chapter bodies are loaded lazily per topic).
const TITLE_OVERLAYS: Partial<Record<Lang, CurriculumTitleOverlay>> = {
  vi: viTitles as CurriculumTitleOverlay,
};

export function localizedPhaseTitle(phaseId: string, englishTitle: string, lang: Lang): string {
  return TITLE_OVERLAYS[lang]?.phases[phaseId]?.title ?? englishTitle;
}

export function localizedTopicTitle(file: string | undefined, englishTitle: string, lang: Lang): string {
  return (file && TITLE_OVERLAYS[lang]?.topics[file]) || englishTitle;
}

/**
 * Lay translated text over the English topic. If the overlay no longer lines up
 * with the English structure (English edited since translation), it is ignored
 * and the English chapter is shown instead of a half-wrong mix.
 */
export function applyOverlay(topic: TopicContent, overlay: TopicOverlay): TopicContent | null {
  const aligned =
    overlay.sections.length === topic.sections.length &&
    overlay.sections.every((o, i) => o.type === topic.sections[i].type) &&
    overlay.quiz.length === topic.quiz.length &&
    overlay.quiz.every((o, i) => o.id === topic.quiz[i].id && o.options.length === topic.quiz[i].options.length);
  if (!aligned) return null;

  return {
    ...topic,
    title: overlay.title,
    tagline: overlay.tagline,
    sections: topic.sections.map((s, i) => {
      const { type: _type, ...text } = overlay.sections[i];
      return { ...s, ...text };
    }),
    quiz: topic.quiz.map((q, i) => ({
      ...q,
      question: overlay.quiz[i].question,
      options: overlay.quiz[i].options,
      explanation: overlay.quiz[i].explanation,
    })),
    visualizer: overlay.visualizerCaption
      ? { ...topic.visualizer, caption: overlay.visualizerCaption }
      : topic.visualizer,
  };
}
