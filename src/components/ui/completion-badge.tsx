interface CompletionBadgeProps {
  read: boolean;
  score?: number;
}

export function CompletionBadge({ read, score }: CompletionBadgeProps) {
  if (!read && score === undefined) return null;

  return (
    <span className="inline-flex items-center gap-1">
      {read && (
        <span className="inline-flex items-center gap-0.5 rounded-full bg-accent-green/15 px-1.5 py-0.5 text-xs font-medium text-accent-green">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
            <path
              d="M1.5 5l2.5 2.5 4.5-4.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Read
        </span>
      )}
      {score !== undefined && (
        <span className="inline-flex items-center rounded-full bg-accent-blue/15 px-1.5 py-0.5 text-xs font-medium text-accent-blue">
          Quiz {score}%
        </span>
      )}
    </span>
  );
}
