import type { VisualizerConfig } from '@/types/content-schema-types';
import { getVisualizer } from '@/components/visualizers/visualizer-registry';
import { VisualgoEmbedFrame } from '@/components/visualizers/visualgo-embed-frame';

interface VisualizerPanelProps {
  visualizer: VisualizerConfig;
}

export function VisualizerPanel({ visualizer }: VisualizerPanelProps) {
  return (
    <div className="bg-bg-card rounded-card border border-border-subtle overflow-hidden flex flex-col">
      <div className="flex-1">
        <VisualizerContent visualizer={visualizer} />
      </div>

      {visualizer.caption && (
        <p className="px-4 py-3 text-xs text-text-muted border-t border-border-subtle text-center">
          {visualizer.caption}
        </p>
      )}
    </div>
  );
}

function VisualizerContent({ visualizer }: { visualizer: VisualizerConfig }) {
  if (visualizer.type === 'embed') {
    return (
      <VisualgoEmbedFrame
        url={visualizer.url!}
        caption={visualizer.caption}
      />
    );
  }

  if (visualizer.type === 'custom') {
    const Component = getVisualizer(visualizer.component!);
    if (!Component) {
      return (
        <div className="flex items-center justify-center min-h-[200px] p-6">
          <p className="text-text-muted text-sm text-center">
            Visualizer{' '}
            <span className="font-mono text-accent-orange">
              {visualizer.component}
            </span>{' '}
            is not yet available.
          </p>
        </div>
      );
    }
    return (
      <div className="p-4">
        <Component />
      </div>
    );
  }

  // type === 'none' — placeholder
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] p-6 gap-3">
      <div className="w-16 h-16 rounded-full bg-bg-panel border border-border-subtle flex items-center justify-center">
        <span className="text-2xl" aria-hidden="true">🖼️</span>
      </div>
      <p className="text-text-muted text-sm text-center">
        Visual illustration coming soon.
      </p>
    </div>
  );
}
