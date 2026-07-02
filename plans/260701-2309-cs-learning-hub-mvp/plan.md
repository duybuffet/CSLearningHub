---
status: pending
created: 2026-07-01
project: cs-learning-hub
work_context: ~/Workspace/cs-learning-hub
---

# CS Learning Hub — MVP Implementation Plan

Dark-theme static learning site (React + Vite + Tailwind) deployed to Vercel. Card-grid homepage + 3-column interactive topic pages (controls | visualization | code). Quiz + localStorage progress. MVP = full scaffold + Phase 1 content (7 topics).

**PRD:** `docs/prd-cs-learning-hub-full-product-requirements.md`
**Brainstorm:** `/Users/duytang/Workspace/jitera/mitaden/plans/reports/brainstorm-260701-2309-cs-learning-hub.md`

## Principles
YAGNI/KISS/DRY. No backend, no auth, no runtime AI. All content = committed JSON. Mobile-first responsive.

## Phases

| # | Phase | Status | Depends |
|---|---|---|---|
| 01 | [Scaffold & Tooling](phase-01-scaffold-and-tooling.md) | pending | — |
| 02 | [Design System & Layout Shell](phase-02-design-system-and-layout.md) | pending | 01 |
| 03 | [Content Schema & Store](phase-03-content-schema-and-store.md) | pending | 01 |
| 04 | [Home Page (Card Grid)](phase-04-home-page.md) | pending | 02,03 |
| 05 | [Topic Page (3-Column)](phase-05-topic-page.md) | pending | 02,03 |
| 06 | [Quiz Component](phase-06-quiz-component.md) | pending | 03,05 |
| 07 | [Visualizers](phase-07-visualizers.md) | pending | 05 |
| 08 | [Phase 1 Content Generation](phase-08-phase1-content.md) | pending | 03 |
| 09 | [Vercel Deploy](phase-09-vercel-deploy.md) | pending | all |

## Key Dependencies
- Content schema (P03) unblocks Home, Topic, Content — do early.
- Content generation (P08) can run parallel to component work (P04-07) once schema fixed.
- Deploy (P09) last.

## MVP Definition of Done
Site live on `*.vercel.app`; Phase 1 fully readable + quizzable on mobile; progress persists; last-visited restored.

## Post-MVP (deferred)
Phases 2-10 content; search; light mode; "explain differently" AI button.
