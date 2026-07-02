# Phase 03 — Content Schema & Progress Store

**Priority:** P0 (unblocks most) · **Status:** pending · **Depends:** 01

## Overview
TS types for content JSON + curriculum. Zustand store w/ localStorage persist for progress. Content loader.

## Related Files (create)
- `src/types/content-schema-types.ts`
- `src/store/progress-store-with-persist.ts`
- `src/hooks/use-topic-progress.ts`
- `src/lib/content-loader.ts` — glob-import JSON via `import.meta.glob('../content/**/*.json')`

## Schema (from PRD §6.5 / §7.4)
- `TopicContent`: id, title, phase, week, icon, tagline, readTime, sections[], visualizer, quiz[]
- `Section` union: intro | analogy | explanation | code_example | code_concept | callout | key_takeaways
- `QuizQuestion`: id, question, type(mcq), options[], correct, explanation
- `Curriculum`: phases[] → weeks[] → topics[]{slug,title,file}
- `TopicProgress`: read, readAt?, quizScore?, quizAttempts, lastVisited?

## Store API
`useProgressStore`: `progress: Record<string,TopicProgress>`, `lastVisited`, `sidebarOpen`; actions `markRead(id)`, `setQuizScore(id,score)`, `setLastVisited(id)`, `toggleSidebar()`. Persist to `localStorage` key `cs-hub-progress`.

## Implementation Steps
1. Define types.
2. Zustand store + `persist` middleware.
3. `use-topic-progress(id)` selector hook → `{progress, markRead, setQuizScore}`.
4. `content-loader`: build slug→loader map from glob; `loadTopic(file)` returns typed JSON; `getCurriculum()`.
5. Compute helpers: `phaseCompletionPct(phaseId)`, `overallPct()`.

## Todo
- [ ] content-schema-types
- [ ] progress store + persist
- [ ] use-topic-progress hook
- [ ] content-loader (glob) + completion helpers

## Success Criteria
Progress survives reload; typed content loads by file path; completion % computes from progress + curriculum.
