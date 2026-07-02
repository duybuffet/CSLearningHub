# Phase 02 — Design System & Layout Shell

**Priority:** P0 · **Status:** pending · **Depends:** 01

## Overview
Dark theme via CSS variables + Tailwind mapping. App shell: sidebar (desktop) + hamburger drawer (mobile) + content outlet.

## Related Files (create)
- `src/index.css` — CSS vars, base dark styles, font imports (Inter + JetBrains Mono via Google Fonts / @fontsource)
- `src/components/layout/app-layout-shell.tsx`
- `src/components/layout/sidebar-navigation-tree.tsx`
- `src/components/layout/mobile-navigation-drawer.tsx`
- `src/components/ui/progress-bar.tsx`
- `src/components/ui/completion-badge.tsx`

## Design Tokens (from PRD §4)
bg `#0d0d1a`, card `#1a1a2e`, code `#0f0f23`; text `#fff`/`#a0a0b0`/`#6060a0`; accent orange `#f5a623`, green `#4ade80`, blue `#60a5fa`. radius card 16px, btn 8px.

## Implementation Steps
1. `index.css`: declare `:root` vars; set body bg/text; import fonts.
2. Map vars into `tailwind.config.ts` `theme.extend.colors` (e.g. `bg-primary`, `accent-orange`).
3. `app-layout-shell.tsx`: flex row — sidebar (fixed 240px, `hidden md:block`) + `<Outlet/>`. Mobile: top bar w/ hamburger toggling drawer (Zustand `sidebarOpen`).
4. `sidebar-navigation-tree.tsx`: read `curriculum.json`; render collapsible phases → topics w/ read ✓ icons; active-route highlight; overall progress at bottom.
5. `mobile-navigation-drawer.tsx`: full-screen overlay reusing tree; close on nav.
6. `progress-bar.tsx`: `value` (0-100) prop → filled bar, accent color.

## Todo
- [ ] CSS vars + fonts + Tailwind color mapping
- [ ] Layout shell (responsive sidebar/drawer)
- [ ] Sidebar tree consuming curriculum + progress
- [ ] Mobile drawer
- [ ] ProgressBar + Badge ui atoms

## Success Criteria
Dark shell renders; sidebar collapses to hamburger < 768px; nav links route correctly; progress bar reflects store.

## Depends On
Phase 03 store + curriculum for tree data — stub with empty progress if 03 not done; wire after.
