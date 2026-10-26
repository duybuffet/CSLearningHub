import { Link } from 'react-router-dom';
import type { NumberedTopic } from '@/lib/content-loader';

interface QuizResultSummaryProps {
  score: number;
  bestScore?: number;
  correctCount: number;
  total: number;
  onRetry: () => void;
  next?: NumberedTopic;
}

export function QuizResultSummary({ score, bestScore, correctCount, total, onRetry, next }: QuizResultSummaryProps) {
  const message =
    score === 100
      ? 'Every answer correct.'
      : score >= 70
        ? 'Solid. Skim the explanations for the ones you missed.'
        : 'Re-read the sections behind the questions you missed, then try again.';

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="font-serif text-[40px] leading-none text-text-primary">
          {correctCount}
          <span className="text-text-muted"> / {total}</span>
        </p>
        <p className="mt-2 font-sans text-[15px] text-text-secondary">{message}</p>
        {bestScore !== undefined && bestScore > score && (
          <p className="mt-1 font-sans text-sm text-text-muted">Your best is {bestScore}%.</p>
        )}
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <button
          onClick={onRetry}
          className="rounded-btn border border-border-subtle bg-bg-card px-4 py-2.5 font-sans text-sm font-medium text-text-primary hover:border-accent/60"
        >
          Try again
        </button>
        {next && (
          <Link
            to={next.href}
            className="rounded-btn bg-accent px-4 py-2.5 text-center font-sans text-sm font-medium text-bg-primary hover:bg-accent/90"
          >
            Next: {next.number} {next.title}
          </Link>
        )}
      </div>
    </div>
  );
}
