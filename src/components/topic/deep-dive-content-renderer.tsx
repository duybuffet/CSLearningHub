import type { ContentSection, CalloutVariant } from '@/types/content-schema-types';
import { MermaidDiagramRenderer } from '@/components/ui/mermaid-diagram-renderer';
import { SyntaxHighlightedCodeBlock } from '@/components/ui/syntax-highlighted-code-block';
import { ProseMarkdownRenderer } from './prose-markdown-renderer';
import { useT, type StringKey } from '@/lib/ui-strings';

interface DeepDiveContentRendererProps {
  sections: ContentSection[];
  mode?: 'deep' | 'compact';
}

// Compact (quick review) shows only the skimmable essentials.
const COMPACT_TYPES = new Set<string>([
  'intro',
  'diagram',
  'callout',
  'code_concept',
  'key_takeaways',
]);

// Margin-note style asides: a colored rule plus a plain-language label.
const CALLOUTS: Record<CalloutVariant, { rule: string; label: StringKey; labelColor: string }> = {
  tip: { rule: 'border-success', label: 'tip', labelColor: 'text-success' },
  info: { rule: 'border-accent', label: 'note', labelColor: 'text-accent' },
  warning: { rule: 'border-warn', label: 'watchOut', labelColor: 'text-warn' },
};

// Reading text: serif, generous leading, ~68ch measure.
const BODY = 'font-serif text-[17.5px] leading-[1.72] text-text-secondary sm:text-[18.5px]';

export function DeepDiveContentRenderer({
  sections,
  mode = 'deep',
}: DeepDiveContentRendererProps) {
  const visible =
    mode === 'compact' ? sections.filter((s) => COMPACT_TYPES.has(s.type)) : sections;

  if (visible.length === 0) return null;

  return (
    <article className="max-w-prose space-y-7 pb-6">
      {visible.map((section, i) => (
        <SectionBlock key={i} section={section} first={i === 0} />
      ))}
    </article>
  );
}

function SectionBlock({ section, first }: { section: ContentSection; first: boolean }) {
  switch (section.type) {
    case 'intro':
    case 'explanation':
      return <ProseBlock section={section} lead={first && section.type === 'intro'} />;

    case 'analogy':
      return <AnalogyAside section={section} />;

    case 'diagram':
      return section.mermaid ? (
        <MermaidDiagramRenderer chart={section.mermaid} caption={section.caption} />
      ) : null;

    case 'code_example':
    case 'code_concept':
      return <InlineCodeBlock section={section} />;

    case 'callout':
      return <CalloutBox section={section} />;

    case 'key_takeaways':
      return <KeyTakeaways section={section} />;

    default:
      return null;
  }
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-3 pt-4 font-sans text-[21px] font-semibold leading-snug tracking-[-0.01em] text-text-primary sm:text-[23px]">
      {children}
    </h2>
  );
}

function ProseBlock({ section, lead }: { section: ContentSection; lead: boolean }) {
  return (
    <section>
      {section.title && <SectionHeading>{section.title}</SectionHeading>}
      <ProseMarkdownRenderer
        text={section.content ?? ''}
        // Opening paragraph reads a touch larger, like a chapter lede
        className={lead ? `${BODY} [&>p:first-child]:text-[1.06em] [&>p:first-child]:text-text-primary` : BODY}
      />
    </section>
  );
}

function AnalogyAside({ section }: { section: ContentSection }) {
  return (
    <aside className="border-l-2 border-accent-purple/60 pl-5">
      {section.title && (
        <p className="mb-1.5 font-sans text-sm font-semibold text-text-primary">{section.title}</p>
      )}
      <ProseMarkdownRenderer
        text={section.content ?? ''}
        className="font-serif text-[16.5px] italic leading-[1.7] text-text-secondary sm:text-[17.5px]"
      />
    </aside>
  );
}

function CalloutBox({ section }: { section: ContentSection }) {
  const style = CALLOUTS[section.variant ?? 'info'];
  const { t } = useT();
  return (
    <aside className={`rounded-r-btn border-l-[3px] ${style.rule} bg-bg-panel/60 py-3.5 pl-4 pr-4`}>
      <p className="mb-1 font-sans text-sm">
        <span className={`font-semibold ${style.labelColor}`}>{t(style.label)}</span>
        {section.title && <span className="font-semibold text-text-primary">: {section.title}</span>}
      </p>
      <ProseMarkdownRenderer
        text={section.content ?? ''}
        className="font-serif text-[16.5px] leading-[1.65] text-text-secondary"
      />
    </aside>
  );
}

function InlineCodeBlock({ section }: { section: ContentSection }) {
  if (!section.code) return null;
  return (
    <section className="space-y-3">
      {section.title && (
        <h3 className="font-sans text-base font-semibold text-text-primary">{section.title}</h3>
      )}
      <SyntaxHighlightedCodeBlock code={section.code} language={section.language} />
      {section.explanation && (
        <ProseMarkdownRenderer text={section.explanation} className="font-serif text-[16.5px] leading-[1.65] text-text-secondary" />
      )}
    </section>
  );
}

function KeyTakeaways({ section }: { section: ContentSection }) {
  const { t } = useT();
  return (
    <section className="border-t border-border-subtle pt-6">
      <h2 className="mb-4 font-sans text-[21px] font-semibold text-text-primary sm:text-[23px]">
        {section.title || t('keyTakeaways')}
      </h2>
      <ul className="space-y-3">
        {(section.items ?? []).map((item, i) => (
          <li key={i} className="flex gap-3 font-serif text-[16.5px] leading-[1.6] text-text-secondary sm:text-[17.5px]">
            <svg width="16" height="16" viewBox="0 0 16 16" className="mt-[0.35em] shrink-0 text-success" aria-hidden="true">
              <path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="min-w-0 break-words">
              <ProseMarkdownRenderer text={item} inline />
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
