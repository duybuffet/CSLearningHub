// ── Content schema (PRD §6.5) ────────────────────────────────
// Shared contract consumed by content loader, topic page, quiz, home cards.

export type SectionType =
  | 'intro'
  | 'analogy'
  | 'explanation'
  | 'diagram'
  | 'code_example'
  | 'code_concept'
  | 'callout'
  | 'key_takeaways';

export type CalloutVariant = 'tip' | 'warning' | 'info';

export interface ContentSection {
  type: SectionType;
  /** heading for analogy/explanation blocks */
  title?: string;
  /** prose body (markdown-lite: paragraphs separated by \n\n) */
  content?: string;
  /** code_example / code_concept */
  language?: string;
  code?: string;
  /** tab label for code blocks, e.g. "Runtime" | "Concept" */
  label?: string;
  /** explanation shown beneath a code block */
  explanation?: string;
  /** callout styling */
  variant?: CalloutVariant;
  /** key_takeaways bullet list */
  items?: string[];
  /** diagram: Mermaid source (flowchart, sequenceDiagram, classDiagram, stateDiagram, etc.) */
  mermaid?: string;
  /** diagram caption shown beneath the rendered figure */
  caption?: string;
}

export type QuizQuestionType = 'mcq';

export interface QuizQuestion {
  id: string;
  question: string;
  type: QuizQuestionType;
  options: string[];
  /** index into options */
  correct: number;
  explanation: string;
}

export type VisualizerType = 'embed' | 'custom' | 'none';

export interface VisualizerConfig {
  type: VisualizerType;
  /** embed: VisuAlgo (or other) iframe url */
  url?: string;
  /** custom: key into the visualizer registry */
  component?: string;
  caption?: string;
}

export interface TopicContent {
  id: string; // e.g. "phase1_week1_binary-and-bits"
  title: string;
  phase: number;
  week: number;
  icon: string; // key into topic-card-icon SVG map
  tagline: string;
  readTime: string; // e.g. "15 min"
  sections: ContentSection[];
  visualizer: VisualizerConfig;
  quiz: QuizQuestion[];
}

// ── Curriculum tree (PRD §7.4) ────────────────────────────────
export interface CurriculumTopic {
  slug: string;
  title: string;
  /** path relative to src/content, e.g. "phase1/week1-...json"; omitted if not yet generated */
  file?: string;
}

export interface CurriculumWeek {
  id: string;
  title: string;
  topics: CurriculumTopic[];
}

export interface CurriculumPhase {
  id: string; // "phase1"
  title: string;
  icon: string;
  weeks: CurriculumWeek[];
}

export interface Curriculum {
  phases: CurriculumPhase[];
}

// ── Progress (PRD §6.1) ───────────────────────────────────────
export interface TopicProgress {
  read: boolean;
  readAt?: string; // ISO date
  quizScore?: number; // best 0-100
  quizAttempts: number;
  lastVisited?: string; // ISO date
}
