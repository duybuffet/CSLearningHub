import { useEffect, useRef, useState } from 'react';
import { useColorScheme, type ColorScheme } from '@/hooks/use-color-scheme';

type Mermaid = typeof import('mermaid').default;

// Lazy singleton mermaid module; re-initialized per render so diagrams follow light/dark.
let mermaidPromise: Promise<Mermaid> | null = null;

function getMermaid(): Promise<Mermaid> {
  if (!mermaidPromise) mermaidPromise = import('mermaid').then((m) => m.default);
  return mermaidPromise;
}

// Diagrams drawn like book figures: white/graphite boxes, ink lines, one accent for emphasis.
const THEMES: Record<ColorScheme, Record<string, string>> = {
  light: {
    background: '#ffffff',
    primaryColor: '#ffffff',
    primaryTextColor: '#1d2025',
    primaryBorderColor: '#8a9099',
    secondaryColor: '#eef2f7',
    secondaryBorderColor: '#1f4e79',
    tertiaryColor: '#f6f6f3',
    lineColor: '#555b64',
    textColor: '#1d2025',
    noteBkgColor: '#fbf3c4',
    noteTextColor: '#1d2025',
    noteBorderColor: '#d9c45a',
    actorBkg: '#ffffff',
    actorBorder: '#8a9099',
    signalColor: '#3f444c',
    clusterBkg: '#f6f6f3',
    clusterBorder: '#dedfda',
    edgeLabelBackground: '#ffffff',
  },
  dark: {
    background: '#1e2126',
    primaryColor: '#262a30',
    primaryTextColor: '#e9e9e5',
    primaryBorderColor: '#5c626c',
    secondaryColor: '#243142',
    secondaryBorderColor: '#8db4e8',
    tertiaryColor: '#1e2126',
    lineColor: '#9aa0a8',
    textColor: '#e9e9e5',
    noteBkgColor: '#3b3620',
    noteTextColor: '#f0e096',
    noteBorderColor: '#6f6430',
    actorBkg: '#262a30',
    actorBorder: '#5c626c',
    signalColor: '#c8cbd0',
    clusterBkg: '#1b1e22',
    clusterBorder: '#30333a',
    edgeLabelBackground: '#1e2126',
  },
};

let diagramSeq = 0;

// Wide diagrams would otherwise shrink to fit a phone and become unreadable.
// Never scale below this fraction of natural size — scroll horizontally instead.
const MIN_DIAGRAM_SCALE = 0.65;

function withMinReadableWidth(svg: string): string {
  const openTag = /^\s*<svg\b[^>]*>/.exec(svg)?.[0];
  const natural = Number(/viewBox="[\d.-]+ [\d.-]+ ([\d.]+)/.exec(openTag ?? '')?.[1]);
  if (!openTag || !natural) return svg;
  const minWidth = `min-width: ${Math.round(natural * MIN_DIAGRAM_SCALE)}px;`;
  const patched = openTag.includes('style="')
    ? openTag.replace('style="', `style="${minWidth} `)
    : openTag.replace('<svg', `<svg style="${minWidth}"`);
  return patched + svg.slice(openTag.length);
}

interface MermaidDiagramRendererProps {
  chart: string;
  caption?: string;
}

// Renders a Mermaid diagram to inline SVG. Falls back to the raw source on error.
export function MermaidDiagramRenderer({ chart, caption }: MermaidDiagramRendererProps) {
  const scheme = useColorScheme();
  const [svg, setSvg] = useState<string>('');
  const [failed, setFailed] = useState(false);
  const [overflows, setOverflows] = useState(false);
  const idRef = useRef(`mmd-${(diagramSeq += 1)}`);
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    setFailed(false);
    setSvg(''); // don't show the previous chart while the new one renders
    getMermaid()
      .then((mermaid) => {
        mermaid.initialize({
          startOnLoad: false,
          theme: 'base',
          securityLevel: 'strict',
          fontFamily: '"IBM Plex Sans", system-ui, sans-serif',
          themeVariables: { ...THEMES[scheme], fontSize: '15px' },
        });
        return mermaid.render(idRef.current, chart);
      })
      .then(({ svg }) => {
        if (!cancelled) setSvg(withMinReadableWidth(svg));
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [chart, scheme]);

  // Show a scroll hint only when the diagram is wider than its frame (phones)
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el || !svg) return;
    const check = () => setOverflows(el.scrollWidth > el.clientWidth + 1);
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, [svg]);

  if (failed) {
    return (
      <pre className="rounded-card bg-bg-code p-4 text-xs text-text-muted overflow-x-auto font-mono">
        {chart}
      </pre>
    );
  }

  return (
    <figure className="-mx-4 border-y border-border-subtle bg-bg-card px-4 py-5 sm:mx-0 sm:rounded-card sm:border">
      {/* Block + auto margins (not flex centering) so overflow scrolls from the left edge */}
      <div
        ref={scrollerRef}
        className="min-h-[3rem] overflow-x-auto overscroll-x-contain [&_svg]:mx-auto [&_svg]:block [&_svg]:h-auto"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: svg }}
      />
      {(caption || overflows) && (
        <figcaption className="mx-auto mt-4 max-w-prose font-serif text-[15px] italic leading-snug text-text-muted">
          {overflows && (
            <span className="block pb-1 font-sans text-xs not-italic">Scroll sideways to see the whole figure.</span>
          )}
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
