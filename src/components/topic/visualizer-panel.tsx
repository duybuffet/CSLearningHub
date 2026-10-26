import type { VisualizerConfig } from '@/types/content-schema-types';
import { getVisualizer } from '@/components/visualizers/visualizer-registry';
import { VisualgoEmbedFrame } from '@/components/visualizers/visualgo-embed-frame';

interface VisualizerPanelProps {
  visualizer: VisualizerConfig;
}

// Interactive figure above the chapter text (custom widget or VisuAlgo embed).
export function VisualizerPanel({ visualizer }: VisualizerPanelProps) {
  if (visualizer.type === 'embed' && visualizer.url) {
    return <VisualgoEmbedFrame url={visualizer.url} caption={visualizer.caption} />;
  }

  const Component = visualizer.type === 'custom' && visualizer.component ? getVisualizer(visualizer.component) : null;
  if (!Component) return null;

  return (
    <figure className="-mx-4 border-y border-border-subtle bg-bg-card px-4 py-5 sm:mx-0 sm:rounded-card sm:border sm:px-6">
      <Component />
      {visualizer.caption && (
        <figcaption className="mt-4 font-serif text-[15px] italic leading-snug text-text-muted">{visualizer.caption}</figcaption>
      )}
    </figure>
  );
}
