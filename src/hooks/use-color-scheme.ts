import { useEffect, useState } from 'react';

export type ColorScheme = 'light' | 'dark';

const query = '(prefers-color-scheme: dark)';

function current(): ColorScheme {
  return typeof window !== 'undefined' && window.matchMedia?.(query).matches ? 'dark' : 'light';
}

// System light/dark preference, live-updated (for things CSS can't theme, like Mermaid SVGs).
export function useColorScheme(): ColorScheme {
  const [scheme, setScheme] = useState<ColorScheme>(current);
  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setScheme(current());
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);
  return scheme;
}
