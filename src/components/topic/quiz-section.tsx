import { useState } from 'react';
import type { QuizQuestion } from '@/types/content-schema-types';
import type { NumberedTopic } from '@/lib/content-loader';
import { useTopicProgress } from '@/hooks/use-topic-progress';
import { QuizQuestionCard } from './quiz-question-card';
import { QuizResultSummary } from './quiz-result-summary';
import { useT } from '@/lib/ui-strings';

interface QuizSectionProps {
  topicId: string;
  quiz: QuizQuestion[];
  next?: NumberedTopic;
}

type QuizState = 'idle' | 'answering' | 'done';

export function QuizSection({ topicId, quiz, next }: QuizSectionProps) {
  const [state, setState] = useState<QuizState>('idle');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [finalScore, setFinalScore] = useState(0);
  const { progress, setQuizScore } = useTopicProgress(topicId);
  const { t } = useT();

  if (!quiz || quiz.length === 0) return null;
  const total = quiz.length;

  function start() {
    setCurrentIndex(0);
    setCorrectCount(0);
    setFinalScore(0);
    setState('answering');
  }

  function handleAnswered(correct: boolean) {
    const newCorrect = correctCount + (correct ? 1 : 0);
    setCorrectCount(newCorrect);
    if (currentIndex + 1 >= total) {
      const pct = Math.round((newCorrect / total) * 100);
      setFinalScore(pct);
      setQuizScore(pct);
      setState('done');
    } else {
      setCurrentIndex((i) => i + 1);
    }
  }

  return (
    <section className="max-w-prose rounded-card border border-border-subtle bg-bg-card/60 p-5 sm:p-6" aria-labelledby="quiz-heading">
      <div className="mb-4 flex items-baseline justify-between gap-3">
        <h2 id="quiz-heading" className="font-sans text-[19px] font-semibold text-text-primary">
          {t('checkUnderstanding')}
        </h2>
        {state === 'answering' && (
          <span className="shrink-0 font-sans text-sm text-text-muted">
            {t('questionOf', { i: currentIndex + 1, n: total })}
          </span>
        )}
      </div>

      {state === 'idle' && (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
          <button
            onClick={start}
            className="rounded-btn bg-accent px-5 py-2.5 font-sans text-sm font-medium text-bg-primary hover:bg-accent/90"
          >
            {progress.quizScore !== undefined ? t('retakeQuiz') : t('startQuiz')}
          </button>
          <span className="font-sans text-sm text-text-muted">
            {t('questions', { n: total })}
            {progress.quizScore !== undefined && t('bestScore', { score: progress.quizScore })}
          </span>
        </div>
      )}

      {state === 'answering' && (
        <>
          <div className="mb-5 h-0.5 w-full bg-border-subtle" aria-hidden="true">
            <div className="h-full bg-accent transition-[width] duration-300" style={{ width: `${(currentIndex / total) * 100}%` }} />
          </div>
          <QuizQuestionCard
            key={quiz[currentIndex].id}
            question={quiz[currentIndex]}
            questionNumber={currentIndex + 1}
            total={total}
            onAnswered={handleAnswered}
          />
        </>
      )}

      {state === 'done' && (
        <QuizResultSummary
          score={finalScore}
          bestScore={progress.quizScore}
          correctCount={correctCount}
          total={total}
          onRetry={start}
          next={next}
        />
      )}
    </section>
  );
}
