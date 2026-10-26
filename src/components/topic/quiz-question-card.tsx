import { useState } from 'react';
import type { QuizQuestion } from '@/types/content-schema-types';
import { useT } from '@/lib/ui-strings';

interface QuizQuestionCardProps {
  question: QuizQuestion;
  questionNumber: number;
  total: number;
  onAnswered: (correct: boolean) => void;
}

export function QuizQuestionCard({ question, questionNumber, total, onAnswered }: QuizQuestionCardProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const answered = selected !== null;
  const isLast = questionNumber === total;
  const { t } = useT();

  function optionClass(idx: number): string {
    const base =
      'flex w-full gap-3 rounded-btn border px-4 py-3 text-left font-sans text-[15px] leading-snug transition-colors duration-150 ';
    if (!answered) return base + 'border-border-subtle bg-bg-card text-text-primary hover:border-accent/60';
    if (idx === question.correct) return base + 'border-success/70 bg-success/10 text-text-primary';
    if (idx === selected) return base + 'border-danger/70 bg-danger/10 text-text-primary';
    return base + 'border-border-subtle bg-bg-card text-text-muted';
  }

  return (
    <div className="flex flex-col gap-4">
      <p id={`${question.id}-q`} className="font-serif text-[19px] leading-snug text-text-primary">
        {question.question}
      </p>

      <div className="flex flex-col gap-2" role="group" aria-labelledby={`${question.id}-q`}>
        {question.options.map((opt, idx) => (
          <button
            key={idx}
            className={optionClass(idx)}
            onClick={() => !answered && setSelected(idx)}
            aria-disabled={answered}
          >
            <span className="w-4 shrink-0 text-text-muted">{String.fromCharCode(65 + idx)}</span>
            <span className="min-w-0 flex-1">{opt}</span>
            {answered && idx === question.correct && <span className="shrink-0 text-success">{t('correct')}</span>}
            {answered && idx === selected && idx !== question.correct && (
              <span className="shrink-0 text-danger">{t('yourAnswer')}</span>
            )}
          </button>
        ))}
      </div>

      {answered && (
        <>
          <p aria-live="polite" className="border-l-2 border-accent/60 pl-4 font-serif text-[16px] leading-relaxed text-text-secondary">
            {question.explanation}
          </p>
          <div className="flex justify-end">
            <button
              onClick={() => onAnswered(selected === question.correct)}
              className="rounded-btn bg-accent px-5 py-2.5 font-sans text-sm font-medium text-bg-primary hover:bg-accent/90"
            >
              {isLast ? t('seeResults') : t('nextQuestion')}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
