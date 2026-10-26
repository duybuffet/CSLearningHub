import { Link } from 'react-router-dom';
import type { NumberedTopic } from '@/lib/content-loader';
import { localizedTopicTitle } from '@/lib/translation-overlay';
import { useT } from '@/lib/ui-strings';

interface QuizResultSummaryProps {
  score: number;
  bestScore?: number;
  correctCount: number;
  total: number;
  onRetry: () => void;
  next?: NumberedTopic;
}

export function QuizResultSummary({ score, bestScore, correctCount, total, onRetry, next }: QuizResultSummaryProps) {
  const { lang, t } = useT();
  const message = score === 100 ? t('resultPerfect') : score >= 70 ? t('resultGood') : t('resultRetry');

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="font-serif text-[40px] leading-none text-text-primary">
          {correctCount}
          <span className="text-text-muted"> / {total}</span>
        </p>
        <p className="mt-2 font-sans text-[15px] text-text-secondary">{message}</p>
        {bestScore !== undefined && bestScore > score && (
          <p className="mt-1 font-sans text-sm text-text-muted">{t('yourBest', { score: bestScore })}</p>
        )}
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <button
          onClick={onRetry}
          className="rounded-btn border border-border-subtle bg-bg-card px-4 py-2.5 font-sans text-sm font-medium text-text-primary hover:border-accent/60"
        >
          {t('tryAgain')}
        </button>
        {next && (
          <Link
            to={next.href}
            className="rounded-btn bg-accent px-4 py-2.5 text-center font-sans text-sm font-medium text-bg-primary hover:bg-accent/90"
          >
            {t('nextChapter', { number: next.number, title: localizedTopicTitle(next.file, next.title, lang) })}
          </Link>
        )}
      </div>
    </div>
  );
}
