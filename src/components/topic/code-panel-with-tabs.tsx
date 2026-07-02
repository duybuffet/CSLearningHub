import { useState } from 'react';
import type { ContentSection } from '@/types/content-schema-types';
import { SyntaxHighlightedCodeBlock } from '@/components/ui/syntax-highlighted-code-block';

interface CodePanelWithTabsProps {
  sections: ContentSection[];
}

interface CodeTab {
  label: string;
  code: string;
  language: string;
  explanation?: string;
}

export function CodePanelWithTabs({ sections }: CodePanelWithTabsProps) {
  const tabs: CodeTab[] = sections
    .filter((s) => s.type === 'code_example' || s.type === 'code_concept')
    .map((s) => ({
      label: s.label ?? (s.type === 'code_example' ? 'Runtime' : 'Concept'),
      code: s.code ?? '',
      language: s.language ?? 'typescript',
      explanation: s.explanation,
    }));

  const [activeIndex, setActiveIndex] = useState(0);

  if (tabs.length === 0) {
    return (
      <div className="bg-bg-card rounded-card border border-border-subtle p-6 flex items-center justify-center min-h-[200px]">
        <p className="text-text-muted text-sm font-mono">No code examples available.</p>
      </div>
    );
  }

  const active = tabs[activeIndex] ?? tabs[0];

  return (
    <div className="bg-bg-card rounded-card border border-border-subtle overflow-hidden flex flex-col">
      {/* Tab bar */}
      <div className="flex border-b border-border-subtle overflow-x-auto">
        {tabs.map((tab, i) => (
          <button
            key={tab.label + i}
            onClick={() => setActiveIndex(i)}
            className={`
              px-4 py-3 text-sm font-mono whitespace-nowrap transition-colors duration-150 border-b-2
              ${
                i === activeIndex
                  ? 'text-accent-blue border-accent-blue bg-bg-panel'
                  : 'text-text-muted border-transparent hover:text-text-primary hover:bg-bg-panel/50'
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Code block */}
      <div className="p-4 flex-1">
        <SyntaxHighlightedCodeBlock
          code={active.code}
          language={active.language}
        />

        {active.explanation && (
          <p className="mt-4 text-sm text-text-secondary leading-relaxed">
            {active.explanation}
          </p>
        )}
      </div>
    </div>
  );
}
