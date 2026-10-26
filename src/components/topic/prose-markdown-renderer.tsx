import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import type { Element, Text } from 'hast';
import { SyntaxHighlightedCodeBlock } from '@/components/ui/syntax-highlighted-code-block';

// Markdown renderer for topic prose. Content uses lists, GFM tables, fenced code,
// *italic*, blockquotes and single-newline line breaks — all styled for the dark theme.

const REMARK_PLUGINS = [remarkGfm, remarkBreaks];

/** Pull language + raw text out of a fenced block's <pre><code> hast node. */
function fencedCode(node: Element | undefined): { lang?: string; code: string } {
  const codeEl = node?.children.find((c): c is Element => c.type === 'element');
  const cls = (codeEl?.properties?.className as string[] | undefined) ?? [];
  const lang = cls.find((c) => c.startsWith('language-'))?.slice('language-'.length);
  const code = (codeEl?.children ?? [])
    .map((c) => (c.type === 'text' ? (c as Text).value : ''))
    .join('')
    .replace(/\n$/, '');
  return { lang, code };
}

const BLOCK_COMPONENTS: Components = {
  p: ({ children }) => <p>{children}</p>,
  strong: ({ children }) => <strong className="font-semibold text-text-primary">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  a: ({ children, href }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-accent underline decoration-accent/40 underline-offset-[3px] hover:decoration-accent">
      {children}
    </a>
  ),
  ul: ({ children }) => <ul className="list-disc space-y-1.5 pl-6 marker:text-text-muted">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal space-y-1.5 pl-6 marker:text-text-muted marker:font-sans marker:text-[0.85em]">{children}</ol>,
  li: ({ children }) => <li className="pl-1">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-border-subtle pl-4 italic text-text-muted">{children}</blockquote>
  ),
  h1: ({ children }) => <h3 className="font-sans text-base font-semibold text-text-primary">{children}</h3>,
  h2: ({ children }) => <h3 className="font-sans text-base font-semibold text-text-primary">{children}</h3>,
  h3: ({ children }) => <h4 className="font-sans text-[15px] font-semibold text-text-primary">{children}</h4>,
  h4: ({ children }) => <h4 className="font-sans text-[15px] font-semibold text-text-primary">{children}</h4>,
  table: ({ children }) => (
    <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
      <table className="w-full border-collapse text-left font-sans text-[14px] leading-snug">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="text-text-primary">{children}</thead>,
  th: ({ children }) => (
    <th className="whitespace-nowrap border-b-2 border-text-primary/70 py-2 pr-4 font-semibold">{children}</th>
  ),
  td: ({ children }) => <td className="border-b border-border-subtle py-2 pr-4 align-top">{children}</td>,
  // Fenced blocks → shared highlighter; inline `code` → subtle tint.
  pre: ({ node }) => {
    const { lang, code } = fencedCode(node);
    return (
      <div className="font-sans not-italic">
        <SyntaxHighlightedCodeBlock code={code} language={lang ?? 'text'} />
      </div>
    );
  },
  code: ({ children }) => (
    <code className="break-words rounded bg-bg-panel px-[0.3em] py-[0.1em] font-mono text-[0.82em] text-text-primary">
      {children}
    </code>
  ),
};

// Inline variant (list items, captions): paragraphs collapse to bare spans.
const INLINE_COMPONENTS: Components = {
  ...BLOCK_COMPONENTS,
  p: ({ children }) => <>{children}</>,
};

interface ProseMarkdownRendererProps {
  text: string;
  className?: string;
  inline?: boolean;
}

export function ProseMarkdownRenderer({ text, className = '', inline = false }: ProseMarkdownRendererProps) {
  if (inline) {
    return (
      <ReactMarkdown remarkPlugins={REMARK_PLUGINS} components={INLINE_COMPONENTS}>
        {text}
      </ReactMarkdown>
    );
  }
  return (
    <div className={`space-y-4 break-words ${className}`}>
      <ReactMarkdown remarkPlugins={REMARK_PLUGINS} components={BLOCK_COMPONENTS}>
        {text}
      </ReactMarkdown>
    </div>
  );
}
