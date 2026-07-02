# Phase 04 — Home Page (Card Grid Dashboard)

**Priority:** P1 · **Status:** pending · **Depends:** 02, 03

## Overview
Dark card-grid homepage (ref screenshots): header + overall progress + collapsible phase sections, each a responsive grid of topic cards.

## Related Files (create)
- `src/pages/home-page.tsx`
- `src/components/home/phase-section-collapsible.tsx`
- `src/components/home/topic-card.tsx`
- `src/components/home/topic-card-icon.tsx` — maps `icon` string → inline SVG (geometric, accent-colored)

## Implementation Steps
1. `home-page.tsx`: header (title + tagline + overall ProgressBar); map curriculum phases → `PhaseSection`.
2. `phase-section-collapsible.tsx`: phase title + phase % bar + collapse toggle; grid `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6`.
3. `topic-card.tsx`: icon, title, tagline, "Open →" link (`/phase/:id/:slug`); status row — ✓ Read + Quiz % from store; hover: lighter bg + accent border glow; completed badge top-right.
4. `topic-card-icon.tsx`: small SVG set (cpu, binary, gate, memory, stack, etc.); fallback generic.

## Todo
- [ ] home-page layout + header + overall progress
- [ ] collapsible phase section w/ per-phase %
- [ ] responsive topic card grid
- [ ] topic card w/ status indicators + hover
- [ ] icon component (SVG map)

## Success Criteria
Grid responsive (1→2→4 cols); cards show live progress; click routes to topic; matches dark reference aesthetic.
