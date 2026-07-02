import { useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { findTopicEntry, loadTopicByFile, topicIdFor } from '@/lib/content-loader';
import { useTopicProgress } from '@/hooks/use-topic-progress';
import { TopicPageHeader } from '@/components/topic/topic-page-header';
import { VisualizerPanel } from '@/components/topic/visualizer-panel';
import { DeepDiveContentRenderer } from '@/components/topic/deep-dive-content-renderer';
import { QuizSection } from '@/components/topic/quiz-section';
import { ViewModeToggle } from '@/components/topic/view-mode-toggle';
import { useProgressStore } from '@/store/progress-store-with-persist';

export function TopicPage() {
  const { phaseId, topicSlug } = useParams<{ phaseId: string; topicSlug: string }>();
  const viewMode = useProgressStore((s) => s.viewMode);

  // Resolve topic content from curriculum + content loader
  const entry = phaseId && topicSlug ? findTopicEntry(phaseId, topicSlug) : null;
  const topic = entry?.topic?.file ? loadTopicByFile(entry.topic.file) : null;

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
  }, [topicId, markRead]);

  if (!topic) {
    return <ContentComingSoon />;
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <TopicPageHeader
          title={topic.title}
          tagline={topic.tagline}
          readTime={topic.readTime}
        />

        {/* Deep chapter vs compact cheat-sheet toggle */}
        <div className="flex justify-center mb-6">
          <ViewModeToggle />
        </div>

        {/* Interactive visualizer (if any) sits at the top, full-width */}
        {topic.visualizer.type !== 'none' && (
          <div className="mb-8">
            <VisualizerPanel visualizer={topic.visualizer} />
          </div>
        )}

        {/* Single flowing article — prose, diagrams, and inline code in order */}
        <DeepDiveContentRenderer sections={topic.sections} mode={viewMode} />

        {/* Scroll sentinel — triggers markRead when visible */}
        <div ref={sentinelRef} aria-hidden="true" className="h-1" />

        {/* Quiz */}
        {topic.quiz.length > 0 && (
          <div className="mt-8 mb-12">
            <QuizSection topicId={topicId} quiz={topic.quiz} />
          </div>
        )}
      </div>
    </div>
  );
}

function ContentComingSoon() {
  return (
    <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center px-4 text-center gap-6">
      <div className="text-5xl" aria-hidden="true">🚧</div>
      <h1 className="text-2xl font-bold text-text-primary">Content Coming Soon</h1>
      <p className="text-text-secondary max-w-sm">
        This topic hasn't been published yet. Check back soon — we're working on it!
      </p>
      <Link
        to="/"
        className="px-4 py-2 rounded-btn bg-bg-card border border-border-subtle text-text-secondary hover:text-text-primary hover:border-accent-blue transition-colors duration-150 text-sm"
      >
        ← Back to all topics
      </Link>
    </div>
  );
}
