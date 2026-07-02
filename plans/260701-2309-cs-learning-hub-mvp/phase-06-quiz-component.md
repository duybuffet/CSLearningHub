# Phase 06 — Quiz Component

**Priority:** P1 · **Status:** pending · **Depends:** 03, 05

## Overview
Per-topic 10-question MCQ quiz w/ immediate feedback, progress bar, final score screen, retry. Score persisted.

## Related Files (create)
- `src/components/topic/quiz-section.tsx` — container/state machine
- `src/components/topic/quiz-question-card.tsx`
- `src/components/topic/quiz-result-summary.tsx`

## Implementation Steps
1. `quiz-section.tsx`: state `idle | answering | done`; track current index, answers[], score; progress bar (q x/10).
2. `quiz-question-card.tsx`: question + options; on select → lock, show green ✓/red ✗ + `explanation`; "Next →" advances.
3. On finish → compute %; `setQuizScore(topicId, pct)` (store best); render `quiz-result-summary`.
4. `quiz-result-summary.tsx`: score, best score, "Retry" (reset state) + "Next Topic →" (route to next slug from curriculum).

## Todo
- [ ] quiz state machine + progress
- [ ] question card w/ immediate feedback + explanation
- [ ] result summary w/ retry + next-topic
- [ ] persist best score to store

## Success Criteria
10 Qs flow with feedback; score computed + persisted (best kept); retry resets; next-topic routes correctly; mobile-friendly tap targets.
