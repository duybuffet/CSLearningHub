# Phase 05 — Topic Page (3-Column Interactive)

**Priority:** P1 · **Status:** pending · **Depends:** 02, 03

## Overview
Topic page: back link + header, then 3-column layout (controls | visualization | code panel), then full-width deep-dive + quiz below. Stacks vertically on mobile.

## Related Files (create)
- `src/pages/topic-page.tsx` — loads JSON by route params
- `src/components/topic/topic-page-header.tsx`
- `src/components/topic/visualizer-panel.tsx` — dispatches embed vs custom component
- `src/components/topic/code-panel-with-tabs.tsx` — Runtime/Concept tabs
- `src/components/topic/deep-dive-content-renderer.tsx` — renders section union
- `src/components/ui/syntax-highlighted-code-block.tsx` — Shiki + copy btn

## Implementation Steps
1. `topic-page.tsx`: parse `:phaseId/:topicSlug` → resolve file from curriculum → `loadTopic()`; loading/error states; `setLastVisited(id)` on mount; `markRead` when deep-dive scrolled to bottom (IntersectionObserver).
2. Layout: `grid lg:grid-cols-[1fr_1.2fr_1fr] gap-6`; mobile `flex-col`.
3. `visualizer-panel.tsx`: if `visualizer.type==='embed'` → responsive iframe; else render custom component by name (Phase 07) w/ controls.
4. `code-panel-with-tabs.tsx`: tabs for code_example (Runtime) + code_concept (Concept); below → callout "Why use this?".
5. `syntax-highlighted-code-block.tsx`: Shiki highlighter (lazy singleton), theme dark; copy button.
6. `deep-dive-content-renderer.tsx`: switch on section.type → styled blocks (intro, analogy card, explanation, callout variants, key_takeaways list).

## Todo
- [ ] topic-page loader + last-visited + scroll-to-read
- [ ] responsive 3-col → stacked layout
- [ ] visualizer-panel dispatcher (embed/custom)
- [ ] code-panel tabs + Shiki block + copy
- [ ] deep-dive section renderer (all types)

## Success Criteria
Loads any Phase-1 JSON; 3 cols on desktop, stacked on mobile; code highlighted; auto marks read on scroll; last-visited persists.
