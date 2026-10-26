import { useProgressStore } from '@/store/progress-store-with-persist';
import { useT } from '@/lib/ui-strings';
import type { Lang } from '@/types/content-schema-types';

const OPTIONS: { lang: Lang; label: string; name: string }[] = [
  { lang: 'en', label: 'EN', name: 'English' },
  { lang: 'vi', label: 'VI', name: 'Tiếng Việt' },
];

// Two-letter EN / VI switch. The choice is persisted with reading progress.
export function LanguageSwitch() {
  const setLang = useProgressStore((s) => s.setLang);
  const { lang, t } = useT();

  return (
    <div role="group" aria-label={t('language')} className="inline-flex shrink-0 rounded-btn bg-bg-panel p-0.5 font-sans">
      {OPTIONS.map((o) => {
        const active = o.lang === lang;
        return (
          <button
            key={o.lang}
            type="button"
            onClick={() => setLang(o.lang)}
            aria-pressed={active}
            title={o.name}
            lang={o.lang}
            className={
              'rounded-[5px] px-2 py-1 text-xs font-medium transition-colors duration-150 ' +
              (active ? 'bg-bg-card text-text-primary shadow-[0_1px_2px_rgb(0_0_0/0.08)]' : 'text-text-muted hover:text-text-primary')
            }
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
