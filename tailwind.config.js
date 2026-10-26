/** @type {import('tailwindcss').Config} */
// Theme tokens are RGB channels defined in src/index.css (light + dark).
const token = (name) => `rgb(var(--${name}) / <alpha-value>)`;

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'bg-primary': token('bg-primary'),
        'bg-card': token('bg-card'),
        'bg-panel': token('bg-panel'),
        'bg-code': token('bg-code'),
        'text-primary': token('text-primary'),
        'text-secondary': token('text-secondary'),
        'text-muted': token('text-muted'),
        'border-subtle': token('border'),
        accent: token('accent'),
        marker: token('marker'),
        'marker-ink': token('marker-ink'),
        success: token('success'),
        danger: token('danger'),
        warn: token('warn'),
        'accent-orange': token('accent-orange'),
        'accent-green': token('accent-green'),
        'accent-blue': token('accent-blue'),
        'accent-purple': token('accent-purple'),
      },
      fontFamily: {
        sans: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
        serif: ['"Source Serif 4"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        card: '10px',
        btn: '6px',
      },
      maxWidth: {
        prose: '68ch',
      },
    },
  },
  plugins: [],
};
