// Maps curriculum icon keys → inline SVG (geometric, accent-colored, ~64px).
// Keys: cpu, code, stack, sort, os, network, database, architecture, pattern, gear,
//       binary, logic-gate, memory. Fallback for unknown keys.
import type { ReactElement } from 'react';

interface TopicCardIconProps {
  icon: string;
  className?: string;
}

const icons: Record<string, ReactElement> = {
  cpu: (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="16" y="16" width="32" height="32" rx="4" stroke="var(--accent-blue)" strokeWidth="2.5" fill="var(--bg-code)" />
      <rect x="22" y="22" width="20" height="20" rx="2" fill="var(--accent-blue)" opacity="0.2" />
      <rect x="26" y="26" width="12" height="12" rx="1" fill="var(--accent-blue)" opacity="0.6" />
      {[20, 28, 36].map((y) => (
        <line key={`l${y}`} x1="8" y1={y} x2="16" y2={y} stroke="var(--accent-blue)" strokeWidth="2" strokeLinecap="round" />
      ))}
      {[20, 28, 36].map((y) => (
        <line key={`r${y}`} x1="48" y1={y} x2="56" y2={y} stroke="var(--accent-blue)" strokeWidth="2" strokeLinecap="round" />
      ))}
      {[20, 28, 36].map((x) => (
        <line key={`t${x}`} x1={x} y1="8" x2={x} y2="16" stroke="var(--accent-blue)" strokeWidth="2" strokeLinecap="round" />
      ))}
      {[20, 28, 36].map((x) => (
        <line key={`b${x}`} x1={x} y1="48" x2={x} y2="56" stroke="var(--accent-blue)" strokeWidth="2" strokeLinecap="round" />
      ))}
    </svg>
  ),

  code: (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polyline points="22,18 8,32 22,46" stroke="var(--accent-orange)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="42,18 56,32 42,46" stroke="var(--accent-orange)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="36" y1="14" x2="28" y2="50" stroke="var(--accent-orange)" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
    </svg>
  ),

  stack: (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="12" y="44" width="40" height="8" rx="2" fill="var(--accent-purple)" opacity="0.9" />
      <rect x="16" y="32" width="32" height="8" rx="2" fill="var(--accent-purple)" opacity="0.7" />
      <rect x="20" y="20" width="24" height="8" rx="2" fill="var(--accent-purple)" opacity="0.5" />
      <rect x="24" y="10" width="16" height="7" rx="2" fill="var(--accent-purple)" opacity="0.3" />
    </svg>
  ),

  sort: (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="48" width="48" height="6" rx="2" fill="var(--accent-green)" opacity="0.9" />
      <rect x="8" y="38" width="36" height="6" rx="2" fill="var(--accent-green)" opacity="0.75" />
      <rect x="8" y="28" width="24" height="6" rx="2" fill="var(--accent-green)" opacity="0.6" />
      <rect x="8" y="18" width="16" height="6" rx="2" fill="var(--accent-green)" opacity="0.4" />
      <rect x="8" y="10" width="8" height="5" rx="2" fill="var(--accent-green)" opacity="0.25" />
    </svg>
  ),

  os: (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="10" width="48" height="36" rx="4" stroke="var(--accent-purple)" strokeWidth="2.5" fill="var(--bg-code)" />
      <rect x="16" y="18" width="32" height="4" rx="1" fill="var(--accent-purple)" opacity="0.5" />
      <rect x="16" y="26" width="20" height="4" rx="1" fill="var(--accent-purple)" opacity="0.35" />
      <rect x="16" y="34" width="26" height="4" rx="1" fill="var(--accent-purple)" opacity="0.25" />
      <line x1="24" y1="46" x2="40" y2="46" stroke="var(--accent-purple)" strokeWidth="2" strokeLinecap="round" />
      <rect x="20" y="50" width="24" height="4" rx="2" fill="var(--accent-purple)" opacity="0.5" />
    </svg>
  ),

  network: (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="6" fill="var(--accent-blue)" opacity="0.9" />
      <circle cx="12" cy="18" r="4" fill="var(--accent-blue)" opacity="0.6" />
      <circle cx="52" cy="18" r="4" fill="var(--accent-blue)" opacity="0.6" />
      <circle cx="12" cy="46" r="4" fill="var(--accent-blue)" opacity="0.6" />
      <circle cx="52" cy="46" r="4" fill="var(--accent-blue)" opacity="0.6" />
      <line x1="26" y1="28" x2="16" y2="21" stroke="var(--accent-blue)" strokeWidth="1.5" opacity="0.7" />
      <line x1="38" y1="28" x2="48" y2="21" stroke="var(--accent-blue)" strokeWidth="1.5" opacity="0.7" />
      <line x1="26" y1="36" x2="16" y2="43" stroke="var(--accent-blue)" strokeWidth="1.5" opacity="0.7" />
      <line x1="38" y1="36" x2="48" y2="43" stroke="var(--accent-blue)" strokeWidth="1.5" opacity="0.7" />
    </svg>
  ),

  database: (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="32" cy="18" rx="20" ry="7" fill="var(--accent-green)" opacity="0.7" />
      <path d="M12 18 v10 c0 3.87 8.95 7 20 7s20-3.13 20-7V18" fill="var(--accent-green)" opacity="0.4" />
      <path d="M12 28 v10 c0 3.87 8.95 7 20 7s20-3.13 20-7V28" fill="var(--accent-green)" opacity="0.25" />
      <ellipse cx="32" cy="18" rx="20" ry="7" stroke="var(--accent-green)" strokeWidth="2" fill="none" />
    </svg>
  ),

  architecture: (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="22" y="8" width="20" height="12" rx="2" fill="var(--accent-orange)" opacity="0.7" />
      <rect x="8" y="38" width="18" height="12" rx="2" fill="var(--accent-orange)" opacity="0.5" />
      <rect x="38" y="38" width="18" height="12" rx="2" fill="var(--accent-orange)" opacity="0.5" />
      <line x1="32" y1="20" x2="32" y2="30" stroke="var(--accent-orange)" strokeWidth="2" strokeLinecap="round" />
      <line x1="32" y1="30" x2="17" y2="38" stroke="var(--accent-orange)" strokeWidth="2" strokeLinecap="round" />
      <line x1="32" y1="30" x2="47" y2="38" stroke="var(--accent-orange)" strokeWidth="2" strokeLinecap="round" />
      <circle cx="32" cy="30" r="3" fill="var(--accent-orange)" />
    </svg>
  ),

  pattern: (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="6" fill="var(--accent-purple)" opacity="0.8" />
      <circle cx="48" cy="16" r="6" fill="var(--accent-purple)" opacity="0.8" />
      <circle cx="32" cy="36" r="6" fill="var(--accent-purple)" opacity="0.8" />
      <circle cx="32" cy="56" r="4" fill="var(--accent-purple)" opacity="0.5" />
      <line x1="22" y1="16" x2="42" y2="16" stroke="var(--accent-purple)" strokeWidth="1.5" />
      <line x1="19" y1="21" x2="28" y2="30" stroke="var(--accent-purple)" strokeWidth="1.5" />
      <line x1="45" y1="21" x2="36" y2="30" stroke="var(--accent-purple)" strokeWidth="1.5" />
      <line x1="32" y1="42" x2="32" y2="52" stroke="var(--accent-purple)" strokeWidth="1.5" />
    </svg>
  ),

  gear: (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="8" stroke="var(--accent-orange)" strokeWidth="3" fill="var(--bg-code)" />
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i * Math.PI * 2) / 8;
        const x1 = 32 + Math.cos(angle) * 13;
        const y1 = 32 + Math.sin(angle) * 13;
        const x2 = 32 + Math.cos(angle) * 20;
        const y2 = 32 + Math.sin(angle) * 20;
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--accent-orange)" strokeWidth="4" strokeLinecap="round" />;
      })}
    </svg>
  ),

  binary: (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <text x="8" y="22" fontFamily="monospace" fontSize="14" fill="var(--accent-green)" opacity="0.9">1010</text>
      <text x="12" y="36" fontFamily="monospace" fontSize="14" fill="var(--accent-green)" opacity="0.65">0110</text>
      <text x="8" y="50" fontFamily="monospace" fontSize="14" fill="var(--accent-green)" opacity="0.4">1101</text>
    </svg>
  ),

  'logic-gate': (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="8" y1="24" x2="20" y2="24" stroke="var(--accent-blue)" strokeWidth="2" strokeLinecap="round" />
      <line x1="8" y1="40" x2="20" y2="40" stroke="var(--accent-blue)" strokeWidth="2" strokeLinecap="round" />
      <path d="M20 16 L20 48 L36 48 Q52 48 52 32 Q52 16 36 16 Z" fill="var(--bg-code)" stroke="var(--accent-blue)" strokeWidth="2.5" />
      <line x1="52" y1="32" x2="60" y2="32" stroke="var(--accent-blue)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),

  memory: (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="20" width="48" height="24" rx="3" stroke="var(--accent-purple)" strokeWidth="2.5" fill="var(--bg-code)" />
      {[16, 24, 32, 40, 48].map((x) => (
        <rect key={x} x={x - 3} y="26" width="6" height="12" rx="1" fill="var(--accent-purple)" opacity="0.6" />
      ))}
      {[16, 24, 32, 40, 48].map((x) => (
        <line key={`p${x}`} x1={x} y1="44" x2={x} y2="50" stroke="var(--accent-purple)" strokeWidth="2" strokeLinecap="round" />
      ))}
    </svg>
  ),
};

const FallbackIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="22" stroke="var(--text-muted)" strokeWidth="2.5" fill="var(--bg-code)" />
    <circle cx="32" cy="32" r="8" fill="var(--text-muted)" opacity="0.4" />
  </svg>
);

export function TopicCardIcon({ icon, className = '' }: TopicCardIconProps) {
  const svgEl = icons[icon] ?? <FallbackIcon />;
  return (
    <span className={`block w-12 h-12 flex-shrink-0 ${className}`}>
      {svgEl}
    </span>
  );
}
