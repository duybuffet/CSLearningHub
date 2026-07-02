import type { ContentSection, CalloutVariant } from '@/types/content-schema-types';
import { MermaidDiagramRenderer } from '@/components/ui/mermaid-diagram-renderer';

interface DeepDiveContentRendererProps {
  sections: ContentSection[];
}

// Sections handled in code panel — skip here to avoid duplication.
const CODE_TYPES = new Set(['code_example', 'code_concept']);

const CALLOUT_STYLES: Record<CalloutVariant, { border: string; bg: string; text: string; icon: string }> = {
  tip: {
    border: 'border-accent-green',
    bg: 'bg-accent-green/10',
    text: 'text-accent-green',
    icon: '💡',
  },
  info: {
    border: 'border-accent-blue',
    bg: 'bg-accent-blue/10',
    text: 'text-accent-blue',
    icon: 'ℹ️',
  },
  warning: {
    border: 'border-accent-orange',
    bg: 'bg-accent-orange/10',
    text: 'text-accent-orange',
    icon: '⚠️',
  },
};

// Lightweight inline markdown: **bold** and `code`. Keeps content authoring natural.
function InlineMarkdown({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).filter(Boolean);
  return (
    <>
      {parts.map((p, i) => {
        if (p.startsWith('**') && p.endsWith('**')) {
          return (
            <strong key={i} className="text-text-primary font-semibold">
              {p.slice(2, -2)}
            </strong>
          );
        }
        if (p.startsWith('`') && p.endsWith('`')) {
          return (
            <code
              key={i}
              className="font-mono text-accent-blue bg-bg-code px-1 py-0.5 rounded text-[0.9em]"
            >
              {p.slice(1, -1)}
            </code>
          );
        }
        return <span key={i}>{p}</span>;
      })}
    </>
  );
}

export function DeepDiveContentRenderer({ sections }: DeepDiveContentRendererProps) {
  const visible = sections.filter((s) => !CODE_TYPES.has(s.type));

  if (visible.length === 0) return null;

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-6">
      {visible.map((section, i) => (
        <SectionBlock key={i} section={section} />
      ))}
    </div>
  );
}

function SectionBlock({ section }: { section: ContentSection }) {
  switch (section.type) {
    case 'intro':
    case 'explanation':
      return <ProseBlock section={section} />;

    case 'analogy':
      return <AnalogyCard section={section} />;

    case 'diagram':
      return section.mermaid ? (
        <MermaidDiagramRenderer chart={section.mermaid} caption={section.caption} />
      ) : null;

    case 'callout':
      return <CalloutBox section={section} />;

    case 'key_takeaways':
      return <KeyTakeaways section={section} />;

    default:
      return null;
  }
}

function ProseBlock({ section }: { section: ContentSection }) {
  const paragraphs = (section.content ?? '').split('\n\n').filter(Boolean);
  return (
    <div>
      {section.title && (
        <h2 className="text-xl font-semibold text-text-primary mb-3">
          {section.title}
        </h2>
      )}
      <div className="space-y-3">
        {paragraphs.map((p, i) => (
          <p key={i} className="text-text-secondary leading-relaxed">
            <InlineMarkdown text={p} />
          </p>
        ))}
      </div>
    </div>
  );
}

function AnalogyCard({ section }: { section: ContentSection }) {
  const paragraphs = (section.content ?? '').split('\n\n').filter(Boolean);
  return (
    <div className="rounded-card border border-accent-purple/40 bg-accent-purple/10 p-5">
      {section.title && (
        <h3 className="text-base font-semibold text-accent-purple mb-2 flex items-center gap-2">
          <span aria-hidden="true">🧠</span>
          {section.title}
        </h3>
      )}
      <div className="space-y-2">
        {paragraphs.map((p, i) => (
          <p key={i} className="text-text-secondary leading-relaxed text-sm">
            <InlineMarkdown text={p} />
          </p>
        ))}
      </div>
    </div>
  );
}

function CalloutBox({ section }: { section: ContentSection }) {
  const variant = section.variant ?? 'info';
  const styles = CALLOUT_STYLES[variant];
  const paragraphs = (section.content ?? '').split('\n\n').filter(Boolean);

  return (
    <div className={`rounded-card border-l-4 ${styles.border} ${styles.bg} p-4`}>
      {section.title && (
        <p className={`text-sm font-semibold ${styles.text} mb-1 flex items-center gap-2`}>
          <span aria-hidden="true">{styles.icon}</span>
          {section.title}
        </p>
      )}
      {!section.title && (
        <span className="text-lg mr-2" aria-hidden="true">{styles.icon}</span>
      )}
      <div className="space-y-2">
        {paragraphs.map((p, i) => (
          <p key={i} className="text-text-secondary text-sm leading-relaxed">
            <InlineMarkdown text={p} />
          </p>
        ))}
      </div>
    </div>
  );
}

function KeyTakeaways({ section }: { section: ContentSection }) {
  return (
    <div>
      {section.title && (
        <h2 className="text-xl font-semibold text-text-primary mb-3">
          {section.title}
        </h2>
      )}
      <ul className="space-y-2">
        {(section.items ?? []).map((item, i) => (
          <li key={i} className="flex items-start gap-3 text-text-secondary text-sm leading-relaxed">
            <span className="mt-0.5 text-accent-green shrink-0" aria-hidden="true">✓</span>
            <span><InlineMarkdown text={item} /></span>
          </li>
        ))}
      </ul>
    </div>
  );
}
