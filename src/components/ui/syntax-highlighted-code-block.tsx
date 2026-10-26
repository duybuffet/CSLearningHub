import { useEffect, useRef, useState } from 'react';
import type { HighlighterCore } from 'shiki/core';

// Lazy singleton highlighter — fine-grained bundle with only the languages the
// content actually uses (keeps the PWA precache small) and the JS regex engine
// (avoids shipping the ~600 KB oniguruma wasm).
let highlighterPromise: Promise<HighlighterCore> | null = null;

function getHighlighter(): Promise<HighlighterCore> {
  if (!highlighterPromise) {
    highlighterPromise = Promise.all([
      import('shiki/core'),
      import('shiki/engine/javascript'),
    ]).then(([{ createHighlighterCore }, { createJavaScriptRegexEngine }]) =>
      createHighlighterCore({
        themes: [import('shiki/themes/github-light.mjs'), import('shiki/themes/github-dark.mjs')],
        langs: [
          import('shiki/langs/javascript.mjs'),
          import('shiki/langs/typescript.mjs'),
          import('shiki/langs/json.mjs'),
          import('shiki/langs/bash.mjs'),
          import('shiki/langs/sql.mjs'),
          import('shiki/langs/yaml.mjs'),
          import('shiki/langs/proto.mjs'),
          import('shiki/langs/dockerfile.mjs'),
          import('shiki/langs/hcl.mjs'),
          import('shiki/langs/html.mjs'),
          import('shiki/langs/markdown.mjs'),
          import('shiki/langs/python.mjs'),
        ],
        engine: createJavaScriptRegexEngine(),
      }),
    );
  }
  return highlighterPromise;
}

// Content uses a few aliases shiki registers under a different id.
const LANG_ALIASES: Record<string, string> = {
  js: 'javascript',
  ts: 'typescript',
  protobuf: 'proto',
  sh: 'bash',
  shell: 'bash',
  yml: 'yaml',
};

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
    getHighlighter()
      .then((hl) => {
        if (cancelled) return;
        const wanted = LANG_ALIASES[language] ?? language;
        // Unknown language → plain text rather than throwing
        const lang = hl.getLoadedLanguages().includes(wanted) ? wanted : 'text';
        // Both themes emitted as CSS vars; index.css picks one per color scheme
        setHtml(
          hl.codeToHtml(code, {
            lang,
            themes: { light: 'github-light', dark: 'github-dark' },
            defaultColor: false,
          }),
        );
      })
      .catch(() => {
        // Highlighter failed to load (e.g. offline chunk miss) — keep plain fallback
      });
    return () => { cancelled = true; };
  }, [code, language]);

  function handleCopy() {
    navigator.clipboard?.writeText(code).then(() => {
      setCopied(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="group relative -mx-4 border-y border-border-subtle bg-bg-code sm:mx-0 sm:rounded-card sm:border">
      {/* Copy button — always visible on touch devices (no hover there) */}
      <button
        onClick={handleCopy}
        className="
          absolute right-2 top-2 z-10
          rounded-btn border border-border-subtle bg-bg-card px-2 py-1 text-xs text-text-muted
          opacity-100 [@media(hover:hover)]:opacity-0 group-hover:opacity-100 focus-visible:opacity-100
          transition-opacity duration-150 hover:text-text-primary
        "
        aria-label="Copy code"
      >
        {copied ? 'Copied' : 'Copy'}
      </button>

      {html ? (
        <div
          className="overflow-x-auto font-mono text-[13px] leading-relaxed sm:text-[13.5px] [&>pre]:m-0 [&>pre]:!bg-transparent [&>pre]:px-4 [&>pre]:py-4 [&>pre]:pr-16"
          // shiki wraps output in <pre style="background:..."> — we override bg
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        // Plain fallback while highlighter loads
        <pre className="m-0 overflow-x-auto whitespace-pre px-4 py-4 pr-16 font-mono text-[13px] leading-relaxed text-text-secondary sm:text-[13.5px]">
          {code}
        </pre>
      )}
    </div>
  );
}
