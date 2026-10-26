interface VisualgoEmbedFrameProps {
  url: string;
  caption?: string;
}

export function VisualgoEmbedFrame({ url, caption }: VisualgoEmbedFrameProps) {
  return (
    <div className="flex flex-col gap-2 w-full">
      {/* Tall container — VisuAlgo needs vertical room; scales with viewport */}
      <div className="relative w-full rounded-card overflow-hidden border border-border-subtle bg-bg-code h-[70vh] min-h-[480px]">
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
          <p className="font-serif text-[15px] italic text-text-muted">{caption}</p>
        )}
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto whitespace-nowrap font-sans text-sm text-accent hover:underline"
        >
          Open in VisuAlgo
        </a>
      </div>
    </div>
  );
}

export default VisualgoEmbedFrame;
