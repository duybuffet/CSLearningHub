import { useCallback } from 'react';
import { useProgressStore } from '@/store/progress-store-with-persist';
import type { TopicProgress } from '@/types/content-schema-types';

const empty: TopicProgress = { read: false, quizAttempts: 0 };

// Convenience selector for a single topic's progress + mutators.
// Callbacks are memoized so effects that depend on them don't loop.
export function useTopicProgress(topicId: string) {
  const progress = useProgressStore((s) => s.progress[topicId]) ?? empty;
  const markReadAction = useProgressStore((s) => s.markRead);
  const setQuizScoreAction = useProgressStore((s) => s.setQuizScore);
  const setLastVisitedAction = useProgressStore((s) => s.setLastVisited);

  const markRead = useCallback(() => markReadAction(topicId), [markReadAction, topicId]);
  const setQuizScore = useCallback(
    (score: number) => setQuizScoreAction(topicId, score),
    [setQuizScoreAction, topicId],
  );
  const setLastVisited = useCallback(
    () => setLastVisitedAction(topicId),
    [setLastVisitedAction, topicId],
  );

  return { progress, markRead, setQuizScore, setLastVisited };
}
