import { Link } from 'react-router-dom';
import { useT } from '@/lib/ui-strings';

interface TopicPageHeaderProps {
  number?: string;
  partTitle: string;
  title: string;
  tagline: string;
  readTime: string;
}

// Chapter opening: chapter number + part link, title, one-line summary.
export function TopicPageHeader({ number, partTitle, title, tagline, readTime }: TopicPageHeaderProps) {
  const { t } = useT();
  // readTime is authored as "~20 min"
  const minutes = /(\d+)/.exec(readTime)?.[1];
  return (
    <header className="max-w-prose pb-6 pt-2 sm:pt-6">
      <p className="mb-5 flex flex-wrap items-baseline gap-x-3 gap-y-1 font-sans text-sm text-text-muted">
        <Link to="/" className="hover:text-accent">
          {t('contents')}
        </Link>
        <span aria-hidden="true">/</span>
        <span>{partTitle}</span>
      </p>

      {number && (
        <p className="mb-1 font-serif text-[26px] leading-none text-accent sm:text-[30px]" aria-label={t('chapter', { n: number })}>
          {number}
        </p>
      )}
      <h1 className="font-serif text-[34px] font-semibold leading-[1.12] tracking-[-0.015em] text-text-primary sm:text-[44px]">
        {title}
      </h1>
      <p className="mt-4 font-sans text-[17px] leading-relaxed text-text-secondary sm:text-lg">{tagline}</p>
      <p className="mt-3 font-sans text-sm text-text-muted">{minutes ? t('readTime', { min: t('minutes', { n: minutes }) }) : readTime}</p>
    </header>
  );
}
