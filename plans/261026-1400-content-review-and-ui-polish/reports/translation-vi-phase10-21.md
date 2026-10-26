# Vietnamese translation — group phase10-21

All 12 overlays validate with 0 errors (`node scripts/validate-translations.mjs vi <slug>`). Remaining warning on the phase21 files is only "curriculum-titles out of sync"; the lead syncs titles.

## phase10
- agile-and-process: title "Agile và quy trình kỹ thuật (Agile & Engineering Process)". Kept Scrum terms in English (Sprint Goal, Product Backlog, Definition of Done, accountability/event/artifact). Glossed the Manifesto opening quote once. Values rendered as "X hơn Y" (the usual Vietnamese rendering).
- debugging-strategies: title "Chiến lược debug (Debugging Strategies)". Glossed "minimal failing case" once. Kept Heisenbug / Scapegoat Commit as English names, with a Vietnamese gloss for the second.
- git-internals: kept title. Glossed "content-addressable object store" once. Did not translate blob/tree/commit/tag/ref/index/reflog/packfile.
- refactoring-techniques: title "Kỹ thuật refactoring (Refactoring Techniques)". All named refactorings and smells (Extract Function, Feature Envy, …) kept in English. Glossed "seam" once.
- software-architecture-styles: title "Các phong cách kiến trúc phần mềm (Software Architecture Styles)". The sample interview answer and the "Let me identify the bounded contexts…" line stay in English, each followed by a short Vietnamese summary. Conway quote kept in English with a gloss. Note: the English source gives Conway as 1968 in the history note but 1967 in the quiz 9 explanation. I left both as written.
- solid-clean-code: kept title. Kept the Liskov/Wing formal definition in English and added a Vietnamese gloss.
- testing-cicd: kept title. Kept DORA metric names and test-double names in English. Glossed "don't mock what you don't own" once.

## phase21
- behavioral-interviews-star: title "Behavioral interview và phương pháp STAR". Sample answers (STAR snippets, conflict quotes, Present/Past/Future pitch, fake-weakness lines) stay in English, since the reader would say them in English, with a "(…)" Vietnamese summary after the long ones. Quiz option texts that quote answers are translated to Vietnamese so the quiz is easy to read.
- big-o-cheatsheet-review: title "Big-O cheatsheet và ôn tập độ phức tạp". Table headers and stable yes/no cells are translated (có/không); all O() cells are unchanged. Kept best/average/worst case, amortised and stable/unstable in English.
- coding-interview-patterns: title "Các pattern trong coding interview (Coding Interview Patterns)". Pattern names and LeetCode problem names stay in English.
- mock-interview-strategy: title "Chiến lược mock interview (Mock Interview Strategy)". Interview phrases (think-aloud lines, hint requests, "let me think…") stay in English, plus one note explaining why.
- system-design-interview-framework: title "Framework cho system design interview". Communication phrases and the opening statement stay in English. Requirement terms are glossed (yêu cầu chức năng / phi chức năng).
