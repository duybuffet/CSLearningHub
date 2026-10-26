import { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  adjacentTopics,
  findTopicEntry,
  getCurriculum,
  loadTopicByFile,
  numberedTopic,
  topicIdFor,
  type NumberedTopic,
} from '@/lib/content-loader';
import { useTopicProgress } from '@/hooks/use-topic-progress';
import { TopicPageHeader } from '@/components/topic/topic-page-header';
import { VisualizerPanel } from '@/components/topic/visualizer-panel';
import { DeepDiveContentRenderer } from '@/components/topic/deep-dive-content-renderer';
import { QuizSection } from '@/components/topic/quiz-section';
import { ViewModeToggle } from '@/components/topic/view-mode-toggle';
import { useProgressStore } from '@/store/progress-store-with-persist';
import type { TopicContent } from '@/types/content-schema-types';

export function TopicPage() {
  const { phaseId, topicSlug } = useParams<{ phaseId: string; topicSlug: string }>();
  const viewMode = useProgressStore((s) => s.viewMode);

  // Resolve topic content from curriculum + content loader
  const entry = phaseId && topicSlug ? findTopicEntry(phaseId, topicSlug) : null;
  const file = entry?.topic?.file;
  // topic: undefined = loading, null = not found; failed = chunk couldn't load (offline / stale deploy)
  const [loaded, setLoaded] = useState<{ file: string; topic: TopicContent | null; failed?: boolean } | null>(null);
  const [attempt, setAttempt] = useState(0);
  const current = loaded && loaded.file === file ? loaded : null;
  const topic = current && !current.failed ? current.topic : undefined;

  useEffect(() => {
    if (!file) return;
    let cancelled = false;
    loadTopicByFile(file)
      .then((t) => !cancelled && setLoaded({ file, topic: t }))
      .catch(() => !cancelled && setLoaded({ file, topic: null, failed: true }));
    return () => { cancelled = true; };
  }, [file, attempt]);

  const topicId = phaseId && topicSlug ? topicIdFor(phaseId, topicSlug) : '';
  const { markRead, setLastVisited } = useTopicProgress(topicId);

  // Track last visited on mount
  useEffect(() => {
    if (topicId) setLastVisited();
  }, [topicId, setLastVisited]);

  // Mark read when the sentinel at the bottom of the deep-dive scrolls into view
  const sentinelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !topicId) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          markRead();
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [topicId, markRead, topic]);

  if (!file || topic === null) {
    return <ContentComingSoon />;
  }

  if (current?.failed) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-prose flex-col justify-center gap-4 font-sans" role="alert">
        <p className="text-text-secondary">This chapter didn't load. Check your connection, then try again.</p>
        <button
          onClick={() => { setLoaded(null); setAttempt((a) => a + 1); }}
          className="self-start rounded-btn border border-border-subtle bg-bg-card px-4 py-2 text-sm text-text-primary hover:border-accent/60"
        >
          Try again
        </button>
      </div>
    );
  }

  if (topic === undefined) {
    return (
      <div className="mx-auto min-h-[60vh] max-w-3xl pt-8 font-sans text-sm text-text-muted" role="status">
        Loading chapter…
      </div>
    );
  }

  const chapter = numberedTopic(phaseId!, topicSlug!);
  const { prev, next } = adjacentTopics(phaseId!, topicSlug!);
  const partTitle = getCurriculum().phases[entry!.phaseIndex].title;

  return (
    <div className="mx-auto max-w-3xl">
      <TopicPageHeader
        number={chapter?.number}
        partTitle={partTitle}
        title={topic.title}
        tagline={topic.tagline}
        readTime={topic.readTime}
      />

      {/* Full chapter vs quick-review toggle */}
      <div className="mb-8 border-b border-border-subtle pb-6">
        <ViewModeToggle />
      </div>

      {/* Interactive visualizer (if any) sits above the text */}
      {topic.visualizer.type !== 'none' && (
        <div className="mb-8 max-w-prose">
          <VisualizerPanel visualizer={topic.visualizer} />
        </div>
      )}

      <DeepDiveContentRenderer sections={topic.sections} mode={viewMode} />

      {/* Scroll sentinel — triggers markRead when visible */}
      <div ref={sentinelRef} aria-hidden="true" className="h-1" />

      {topic.quiz.length > 0 && (
        <div className="mt-6">
          <QuizSection key={topicId} topicId={topicId} quiz={topic.quiz} next={next} />
        </div>
      )}

      <ChapterPager prev={prev} next={next} />
    </div>
  );
}

function ChapterPager({ prev, next }: { prev?: NumberedTopic; next?: NumberedTopic }) {
  if (!prev && !next) return null;
  const link = 'group flex min-w-0 flex-1 flex-col gap-1 py-5 font-sans';
  return (
    <nav aria-label="Chapters" className="mt-12 flex max-w-prose flex-col border-t border-border-subtle sm:flex-row sm:gap-8">
      {prev ? (
        <Link to={prev.href} className={link}>
          <span className="text-sm text-text-muted">Previous</span>
          <span className="truncate text-[15px] text-text-primary group-hover:text-accent">
            {prev.number} {prev.title}
          </span>
        </Link>
      ) : (
        <span className="hidden flex-1 sm:block" />
      )}
      {next && (
        <Link to={next.href} className={`${link} border-t border-border-subtle sm:border-t-0 sm:text-right`}>
          <span className="text-sm text-text-muted">Next</span>
          <span className="truncate text-[15px] text-text-primary group-hover:text-accent">
            {next.number} {next.title}
          </span>
        </Link>
      )}
    </nav>
  );
}

function ContentComingSoon() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-prose flex-col justify-center gap-4">
      <h1 className="font-serif text-3xl font-semibold text-text-primary">This chapter isn't written yet</h1>
      <p className="font-sans text-text-secondary">Pick another chapter from the contents.</p>
      <Link to="/" className="font-sans text-sm text-accent hover:underline">
        Back to contents
      </Link>
    </div>
  );
}
