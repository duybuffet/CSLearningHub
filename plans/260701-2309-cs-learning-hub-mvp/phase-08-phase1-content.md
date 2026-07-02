# Phase 08 — Phase 1 Content Generation

**Priority:** P1 · **Status:** pending · **Depends:** 03 (schema fixed)

## Overview
Claude generates all Phase-1 topic JSON (deep dive, ~1500 words each, 10 quiz Qs) conforming to schema + `curriculum.json`. Runs parallel to component work once schema frozen.

## Related Files (create)
- `src/content/curriculum.json` — full 10-phase tree (only Phase 1 topics have files for MVP)
- `src/content/phase1/week1-how-computers-work-binary-and-bits.json`
- `src/content/phase1/week1-how-computers-work-logic-gates-boolean-algebra.json`
- `src/content/phase1/week1-how-computers-work-cpu-fetch-decode-execute.json`
- `src/content/phase1/week1-how-computers-work-memory-hierarchy.json`
- `src/content/phase1/week3-data-representation-number-encoding.json`
- `src/content/phase1/week3-data-representation-character-encoding.json`
- `src/content/phase1/week3-data-representation-program-execution.json`

## Content Requirements (per topic)
- intro + real-world analogy + explanation sections
- code_example (Runtime trace) + code_concept (clean definition) in JS
- callout (tip / why-it-matters) + key_takeaways (3-5)
- visualizer ref (custom for binary/logic-gate; embed/none for others)
- 10 quiz Qs (MCQ) w/ explanations
- Accuracy: cross-check against Code by Petzold / standard CS references. Treat as draft, flag anything uncertain.

## Todo
- [ ] curriculum.json (all phases, Phase-1 files wired)
- [ ] 7 Phase-1 topic JSON files
- [ ] validate each against content-schema-types (no TS/parse errors)

## Success Criteria
All 7 JSON load without schema errors; content technically accurate; quizzes have correct answer keys + explanations.

## Note
Pilot gate: after Phase 1 live + used ~2 weeks, review format, then generate Phases 2-10 (post-MVP).
