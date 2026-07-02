import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import type { QuizQuestion } from '@/types/content-schema-types';
import { useTopicProgress } from '@/hooks/use-topic-progress';
import { flatTopicList } from '@/lib/content-loader';
import { QuizQuestionCard } from './quiz-question-card';
import { QuizResultSummary } from './quiz-result-summary';

interface QuizSectionProps {
  topicId: string;
  quiz: QuizQuestion[];
}

type QuizState = 'idle' | 'answering' | 'done';

function buildNextTopicHref(topicId: string): string | undefined {
  const all = flatTopicList();
  const currentIdx = all.findIndex(
    (t) => `${t.phaseId}_${t.slug}` === topicId,
  );
  if (currentIdx === -1) return undefined;

  for (let i = currentIdx + 1; i < all.length; i++) {
    const next = all[i];
    if (next.file) {
      return `/phase/${next.phaseId}/${next.slug}`;
    }
  }
  return undefined;
}

export function QuizSection({ topicId, quiz }: QuizSectionProps) {
  const [state, setState] = useState<QuizState>('idle');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [finalScore, setFinalScore] = useState(0);

  const { progress, setQuizScore } = useTopicProgress(topicId);

  if (!quiz || quiz.length === 0) return null;

  const total = quiz.length;

  function handleStart() {
    setCurrentIndex(0);
    setCorrectCount(0);
    setFinalScore(0);
    setState('answering');
  }

  function handleAnswered(correct: boolean) {
    const newCorrect = correctCount + (correct ? 1 : 0);

    if (currentIndex + 1 >= total) {
      const pct = Math.round((newCorrect / total) * 100);
      setCorrectCount(newCorrect);
      setFinalScore(pct);
      setQuizScore(pct);
      setState('done');
    } else {
      setCorrectCount(newCorrect);
      setCurrentIndex((i) => i + 1);
    }
  }

  function handleRetry() {
    setCurrentIndex(0);
    setCorrectCount(0);
    setFinalScore(0);
    setState('answering');
  }

  const nextTopicHref = buildNextTopicHref(topicId);

  return (
    <section className="bg-bg-card rounded-card border border-border-subtle p-6 flex flex-col gap-6">
      <h2 className="text-text-primary font-semibold text-lg">Quiz</h2>

      {state === 'idle' && (
        <div className="flex flex-col items-center gap-4 py-4">
          <p className="text-text-secondary text-sm">
            Test your understanding with {total} question{total !== 1 ? 's' : ''}.
          </p>
          {progress.quizScore !== undefined && (
            <p className="text-text-muted text-xs">
              Best score: <span className="text-text-secondary font-semibold">{progress.quizScore}%</span>
            </p>
          )}
          <button
            onClick={handleStart}
            className="px-6 py-3 rounded-btn bg-accent-orange text-white font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            Start Quiz — {total} question{total !== 1 ? 's' : ''}
          </button>
        </div>
      )}

      {state === 'answering' && (
        <>
          {/* Progress bar */}
          <div className="w-full bg-bg-panel rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-accent-orange h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex) / total) * 100}%` }}
            />
          </div>

          <AnimatePresence mode="wait">
            <QuizQuestionCard
              key={quiz[currentIndex].id}
              question={quiz[currentIndex]}
              questionNumber={currentIndex + 1}
              total={total}
              onAnswered={handleAnswered}
            />
          </AnimatePresence>
        </>
      )}

      {state === 'done' && (
        <QuizResultSummary
          score={finalScore}
          bestScore={progress.quizScore}
          correctCount={correctCount}
          total={total}
          onRetry={handleRetry}
          nextTopicHref={nextTopicHref}
        />
      )}
    </section>
  );
}
