import { useEffect, useRef, useState } from 'react';
import { createHighlighter, type Highlighter } from 'shiki';

// Lazy singleton highlighter — shared across all instances.
let highlighterPromise: Promise<Highlighter> | null = null;

function getHighlighter(): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ['github-dark'],
      langs: [
        'javascript',
        'typescript',
        'python',
        'rust',
        'go',
        'bash',
        'json',
        'markdown',
        'html',
        'css',
      ],
    });
  }
  return highlighterPromise;
}

interface SyntaxHighlightedCodeBlockProps {
  code: string;
  language?: string;
}

export function SyntaxHighlightedCodeBlock({
  code,
  language = 'typescript',
}: SyntaxHighlightedCodeBlockProps) {
  const [html, setHtml] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let cancelled = false;
    getHighlighter().then((hl) => {
      if (cancelled) return;
      // Shiki may not know the lang — fallback to 'text'
      const supportedLangs = hl.getLoadedLanguages();
      const lang = supportedLangs.includes(language as never) ? language : 'text';
      const result = hl.codeToHtml(code, { lang, theme: 'github-dark' });
      if (!cancelled) setHtml(result);
    });
    return () => { cancelled = true; };
  }, [code, language]);

  function handleCopy() {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="relative group rounded-card overflow-hidden border border-border-subtle bg-bg-code">
      {/* Copy button */}
      <button
        onClick={handleCopy}
        className="
          absolute top-3 right-3 z-10
          px-2 py-1 rounded-btn text-xs font-mono
          bg-bg-panel text-text-muted border border-border-subtle
          opacity-0 group-hover:opacity-100
          transition-opacity duration-150
          hover:text-text-primary hover:border-accent-blue
        "
        aria-label="Copy code"
      >
        {copied ? 'Copied!' : 'Copy'}
      </button>

      {html ? (
        <div
          className="overflow-x-auto text-sm font-mono [&>pre]:p-4 [&>pre]:m-0 [&>pre]:bg-transparent!"
          // shiki wraps output in <pre style="background:..."> — we override bg
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        // Plain fallback while highlighter loads
        <pre className="p-4 m-0 overflow-x-auto text-sm font-mono text-text-secondary whitespace-pre">
          {code}
        </pre>
      )}
    </div>
  );
}
