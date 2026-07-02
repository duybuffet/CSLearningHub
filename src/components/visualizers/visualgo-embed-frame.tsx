interface VisualgoEmbedFrameProps {
  url: string;
  caption?: string;
}

export function VisualgoEmbedFrame({ url, caption }: VisualgoEmbedFrameProps) {
  return (
    <div className="flex flex-col gap-2 w-full">
      {/* Tall container — VisuAlgo needs vertical room; scales with viewport */}
      <div className="relative w-full rounded-card overflow-hidden border border-border-subtle bg-bg-code h-[75vh] min-h-[560px]">
        <iframe
          src={url}
          title={caption ?? 'VisuAlgo interactive visualization'}
          allowFullScreen
          loading="lazy"
          className="absolute inset-0 w-full h-full border-0"
        />
      </div>

      {/* Footer row: caption + external link */}
      <div className="flex items-center justify-between gap-2 px-1">
        {caption && (
          <p className="text-text-muted text-xs">{caption}</p>
        )}
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto text-accent-blue text-xs hover:text-accent-blue/80 transition-colors whitespace-nowrap focus:outline-none focus:underline"
        >
          Open in VisuAlgo ↗
        </a>
      </div>
    </div>
  );
}

export default VisualgoEmbedFrame;
