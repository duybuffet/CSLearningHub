# Content Review Brief — CS Learning Hub

Shared instructions for every content agent (reviewers and new-topic writers).
Today is 2026-10-26. The audience: a working software engineer who reads topics on a phone,
wants book-chapter depth, and uses "compact" mode to cram before interviews.

## Files
- Topic JSON: `src/content/<phaseN>/<slug>.json` (schema: `src/types/content-schema-types.ts`).
- Curriculum: `src/content/curriculum.json` — **do not edit** (the lead owns it).
- Only touch the topic files assigned to you. Other agents are editing other files in parallel.
- Validate after every file: `node scripts/validate-content.mjs <slug>` (must print 0 errors).

## Editing safely
Edit with a small Node script: `JSON.parse` → modify → `fs.writeFileSync(p, JSON.stringify(d, null, 2) + "\n")`.
Files are already normalized to that format, so diffs stay minimal. Never hand-edit escaped JSON strings
for multi-line content. Put throwaway scripts in your scratchpad, not the repo.

## What "review" means (priority order)
1. **Factual errors** — wrong definitions, wrong complexities, wrong numbers, mixed-up terms,
   claims that were never true or are outdated as of 2026 (versions, defaults, deprecated APIs, current
   industry practice). Fix the text; don't hedge it into vagueness.
2. **Code bugs** — every `code_example`/`code_concept` and fenced block should be correct. For
   JavaScript/TypeScript, actually run it with `node` (TS: strip types or use `npx tsx` if present) and
   check that any output claimed in comments/explanations matches. Python: `python3`. SQL: reason carefully.
3. **Quiz** — exactly one defensible correct answer; the explanation must agree with the marked option and with
   the article; no trick wording; distractors plausible. Keep answer positions spread (not all the same letter).
   Keep 10 questions per topic. Questions should test understanding, not trivia phrasing.
4. **Diagrams** — Mermaid must match the text (labels, arrows, states). See syntax rules below.
5. **Gaps** — if a topic omits something an engineer would be expected to know (a core sub-concept, a common
   interview angle, a critical caveat), add it: usually 1–3 new `explanation`/`callout`/`code_example` sections in
   the right place, plus a key-takeaway bullet. Don't pad, don't repeat what's already there.
6. **Clarity** — fix confusing or contradictory passages, and obvious typos. Don't rewrite good prose for style.

Leave alone: tone/voice that is fine, section order that works, and anything correct.

## Renderer capabilities (what the app can show)
- Prose fields (`content`, `explanation`, `items[]`) are **Markdown (GFM)**: paragraphs, single newline = line
  break, `- ` / `1. ` lists, tables, `**bold**`, `*italic*`, `` `code` ``, fenced ```lang blocks, `> quote`.
  No HTML, no images, no headings deeper than needed (avoid `#` headings in prose; use a new section title instead).
- Section types: `intro`, `analogy`, `explanation`, `diagram`, `code_example`, `code_concept`, `callout`
  (`variant`: tip|warning|info), `key_takeaways` (`items`). Compact mode shows only intro, diagram, callout,
  code_concept, key_takeaways — so key takeaways must stand on their own as a cheat-sheet.
- Code languages that get highlighting: javascript, typescript, python, json, bash, sql, yaml, proto,
  dockerfile, hcl, html, markdown. Others render as plain text — prefer JavaScript/TypeScript for examples
  unless the topic needs another language (SQL for databases, bash for shells, etc.).
- Mermaid: only `flowchart`, `sequenceDiagram`, `stateDiagram-v2`, `classDiagram` (others aren't cached offline).
  Mermaid pitfalls that break rendering:
  - No `;` inside sequence-diagram messages (it ends the statement).
  - Never put a raw newline inside a single-line note. In `stateDiagram-v2` use the block form
    `note right of X` … `end note`; in `sequenceDiagram` the block form does NOT parse — use a single-line
    `Note right of A: first line<br/>second line`.
  - Flowchart labels containing `( ) [ ] { } : ; " #` or `<>` must be quoted: `A["fetch() → parse"]`.
  - Keep diagrams ≤ ~12 nodes and prefer `flowchart TD` (vertical reads better on phones than wide `LR`).
- Visualizer: leave the existing `visualizer` value as is.

## New topic files (writers)
Match existing topics in depth and shape (look at 2–3 sibling files in the same phase first):
`id` = `<phaseId>_<slug>`, `phase` number, `week` number given in your task, `icon` from
{cpu, code, stack, sort, os, network, database, architecture, pattern, gear, binary, logic-gate, memory},
`tagline` (one sentence), `readTime` like "~20 min", `visualizer: {"type":"none","caption":""}`,
~18–23 sections (intro → analogy → explanations with 4–6 diagrams and 3–4 code examples → common mistakes
→ 1–2 callouts → key_takeaways with 6–10 standalone bullets), and 10 quiz questions (ids `q1`…`q10`).

## Report
When done, write `plans/261026-1400-content-review-and-ui-polish/reports/<your-group>.md`:
per topic, a short bullet list of **what was wrong → what you changed**, and **what you added**. Mark anything you
were unsure about. Keep it skimmable. Your final message should summarize the most important corrections.
