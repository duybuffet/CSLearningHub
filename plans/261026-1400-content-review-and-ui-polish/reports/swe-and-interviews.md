# Content review — swe-and-interviews (phase10 + phase21)

All JS/TS blocks were run with node (a small Jest-compatible shim was used for test code), the YAML workflow was parsed with Ruby, and every Mermaid diagram was parsed with the project's mermaid v11 package. Quiz answer positions were spread out in all 12 files, and explanations that cited "Option C" were rewritten so they don't depend on letters.
`node scripts/validate-content.mjs phase10/ phase21/` → **12 topics, 0 errors, 0 warnings**.

## phase10

### solid-clean-code
- Wrong: the history said Martin "named SOLID in a 2003 paper" and "assembled the acronym ~2000". Fixed: Martin's 2000 paper / 2002 book collected the principles, and Michael Feathers coined SOLID (~2004). Liskov's Turing Award was for her broader work, not for the keynote. Added Parnas, Constantine and Kelly Johnson (KISS).
- LSP is now stated precisely (Liskov–Wing 1994 φ(x) form). Added the contract rules: preconditions, postconditions, invariants, history constraint, no new exceptions, plus variance. Added the point that an immutable Square is a valid subtype. Square/Rectangle is now runnable code (prints 50 / 100).
- DIP: the "inversion" is now defined correctly (source dependencies point against the flow of control). DI is described as the most common mechanism, not the only one.
- Code bug: the naming block threw a `ReferenceError` (`fetchUser`, and `user` used before declaration). Fixed with a stub. The odd `fakeGw` test double is now a recording fake whose output is shown.
- SRP text said "six reasons to change" but listed five. Fixed.
- Quiz: replaced the naming-trivia question with an LSP question about a strengthened precondition.

### testing-cicd
- Code bugs: the TDD listing redeclared `class Cart` four times (SyntaxError). It now uses block-scoped iterations and all 5 tests pass. The spy example used an undefined `OrderService` and called `expect` outside a test. Fixed; it passes.
- Test doubles now use Meszaros's terms (dummy/stub/spy/mock/fake). Added a note that `jest.fn()` is strictly a spy.
- Added mocking guidance: mock at the boundaries you own, "don't mock what you don't own", prefer fakes, over-mocking pins the implementation. Added the classical vs mockist schools.
- Added the testing trophy (Dodds 2018) and the honeycomb as alternatives to the pyramid.
- Added DORA metrics: the four keys, plus reliability (2021) and rework rate (2024). Also added merge queues, OIDC deploy credentials, and SAST/secret scanning/SLSA.
- Supertest claimed "no network port". In fact it uses an ephemeral port; fixed. CI history fixed: Booch 1991, and Fowler/Foemmel 2000 (not 1997). Jest → Jest/Vitest/node:test.
- Quiz: replaced the weak "why are integration tests slower" question with a scenario about "don't mock the SDK".

### git-internals
- SHA-1 callout was wrong: "not used for authentication" (signed tags/commits do rely on it). Rewritten: SHAttered 2017 and chosen-prefix 2020 collisions, SHA-1DC since Git 2.13, SHA-256 format experimental in 2.29 and stable in 2.42, interop as the blocker, SHA-256 planned as default in Git 3.0.
- Reflog: unreachable entries expire after **30 days** (`gc.reflogExpireUnreachable`), not 90. Fixed in the text and the takeaway.
- The merge demo would actually fast-forward. It now uses `--no-ff`. `--amend` is no longer called "a rebase", and its parent is now described correctly. The DAG is described correctly: edges point to parents, and acyclicity comes from hashing, not "time".
- Packfile deltas: the base is chosen by heuristics, usually the newest version is stored whole, and depth is capped. Added multi-pack-index, commit-graph and `git maintenance`.
- Added: full tree modes, packed-refs/reftable, index stat data and conflict stages, the `ort` merge strategy, `--force-with-lease`, `pull --rebase`, rerere, and a bisect `run` exit-code note. Verified the `hello git` blob hash.

### refactoring-techniques
- Code bug: the "refactored" function changed behaviour (it returned 1080 where the original returned 1000). The cap applies to the discounted balance. Fixed, and the misreading is now kept as a deliberate "wrong refactoring" lesson. The Extract Variable block referenced undefined `user`/`grantAccess`. Fixed.
- The classDiagram showed inheritance (`Account --|> AccountSafe`). Changed to a dependency arrow. The sequence diagram (green and then red with no branch) now uses `alt/else`.
- "red → green → refactor" corrected to green → refactor → green. "split into sub-classes" changed to Extract Class.
- Added: Feathers' characterisation tests and seams, Parallel Change (expand/contract), Branch by Abstraction, and a neutral note on AI-assisted refactoring. Corrected the claim that IDE renames touch strings and comments, and refreshed the history.

### software-architecture-styles
- Added a **Hexagonal vs Onion vs Clean** section plus a diagram. It covers the shared Dependency Rule, Cockburn 2005, Palermo 2008, Martin 2012/2017 with use cases and boundaries, and a sample interview answer.
- Added **tactical DDD**: entity, value object, aggregate/root (one aggregate per transaction, references by ID), domain event, repository per aggregate, domain service, factory, anemic model. Also added context map patterns (Open Host, Partnership, Separate Ways) and core/supporting/generic subdomains.
- The hexagonal diagram wired the Email adapter to the `OrderRepository` port. Fixed: separate ports, with adapters that implement them.
- Added the transactional outbox (dual-write problem). Replaced the "Instagram 1B users monolith" claim with a defensible one. Replaced two quiz questions with an aggregate question and a hex/onion/clean question.

### debugging-strategies
- Code bug and factual error: the example claimed `9.99 * '2'` gives `'019.98…'`. It doesn't: `*` coerces, and the actual output was 19.98. The example now falsifies that hypothesis, reproduces the real bug (`qty + 1` → `'21'`), and fixes it at the API boundary. The text and the rubber-duck passage were updated to match.
- `git bisect run` exit codes corrected (125 = skip, >127 aborts). Added `skip`, `--first-parent`, `terms`, `log/replay`.
- Added `debugger;` / `node --inspect-brk`, Node `assert` vs `console.assert`, OpenTelemetry/`traceparent` correlation, `crypto.randomUUID()`, and a neutral tip on AI as a hypothesis generator.

### agile-and-process
- Rewrote the Scrum section to the **2020 Scrum Guide**:
  - one Scrum Team with three *accountabilities*, self-managing (the Development Team is gone);
  - Sprint ≤ 1 month, with time-boxes;
  - Planning covers Why/What/How;
  - the Daily Scrum no longer has the three questions;
  - the Review is a working session;
  - each artifact has a commitment (Product Goal, Sprint Goal, DoD);
  - increments can be released at any time;
  - the DoD is not set at Sprint Planning (the old text said it was);
  - velocity and story points are not part of Scrum.
- Wrong: "gates each faster than the next" was backwards; fixed. Softened the Capers Jones "60–90%" claim.
- CI YAML updated:
  - Node 20 (end-of-life April 2026) → 24;
  - checkout/setup-node v5, codecov v5 with a token;
  - `POSTGRES_DB`, a proper health check, setup-node in every job, and a Playwright browser install;
  - least-privilege permissions.
- Added: trunk-based development and feature flags, an AI-in-review note, DORA/SPACE, and two Scrum-2020 quiz questions (replacing two weaker ones).

## phase21

### big-o-cheatsheet-review
- Factual errors fixed:
  - log₂(10⁶) is ≈20, not 40;
  - O(n log n) at 10⁶ is ~20× the O(n) work, not "+2%";
  - an O(n²) sort of 10⁷ items takes ~28 h, not 3 h;
  - 2¹⁰⁰ is ~10³⁰ operations, not "more than atoms in the universe";
  - "insertion sort may beat merge sort at 10,000 elements" is false;
  - "O(n²) <1 ms in interpreted languages" was overstated;
  - Knuth's Ω/Θ date to his 1976 paper.
- Table values corrected and verified:
  - counting sort space is O(n+k), not O(k);
  - quicksort's O(log n) stack needs smaller-side recursion (otherwise O(n)) and is made unlikely, not avoided, by median-of-three;
  - Timsort minrun is 32–64;
  - the banker's method uses 3 credits.
- Added Timsort (what JS/Python/Java-objects actually use), and a compact-mode **cheatsheet table callout** covering every structure and sort.
- Clarified "Big-O vs worst case" (they are independent), and stopped calling union-find amortised O(1).
- Code bug: `sumDivide([])` recursed forever. Added a guard.
- Quiz: q4 was wrong (resizing *does* make a single insert O(n)). Rewritten. q2 had two defensible answers (O(3n) = O(n)). Fixed.

### coding-interview-patterns
- Code bug: the `twoSumSorted` comment said `[2,4]` but the output is `[1,4]`. Fixed. BFS used `queue.shift()` (O(n) per dequeue). It now uses a head index.
- Added **Monotonic Stack** and **Binary Search incl. "on the answer"** sections, plus a tested template: `firstTrue` with lower bound and Koko eating bananas, and daily temperatures.
- Corrected the sliding-window negative-numbers pitfall. Rewrote the history callout, which had fabricated claims (a "Floyd 1967 report", a "Dijkstra interval merging", "Pascal").
- Tagline and intro now say nine patterns. Added two takeaways and a binary-search-on-answer quiz question.

### system-design-interview-framework
- Code bug: the estimation helper divided KB by 1024³ and labelled the result GB (it is TB), and it estimated storage from *all* requests. Rewritten with decimal units and a write ratio, and the outputs now match the comments. Fixed the offset-pagination explanation (an insert causes a duplicate row, not a skip).
- Fixed:
  - cache/DB latency numbers;
  - "consistent hashing fixes hot keys" (it doesn't; split the keys instead);
  - MySQL binlog vs WAL;
  - token-bucket-in-Redis;
  - the Karlton quote;
  - the speculative "Google invented SD interviews" history.
- Added 2026 format notes: virtual whiteboards, estimation only when it changes a decision, level-dependent depth, LLM-feature questions, and AI policy. Fixed q6, which had two correct options.

### behavioral-interviews-star
- Janz PBDI dated to 1982 (with Flanagan's 1954 critical incident technique as its roots). Added the structured-interview validity research. Replaced made-up weighting numbers ("30–40% / 50–60%").
- Code bug: the validator's first-person check was a substring match. It now uses a word-boundary regex. Its comment said "fails four checks" but the code reports five; fixed.
- Added a section on company rubrics (Amazon Leadership Principles, Google, Meta), follow-up probing and honesty, scope by level, STAR-L/CARL, and 2026 questions about working with AI tools (neutral).

### mock-interview-strategy
- The silence rules contradicted each other (45 s / 60 s / 2–3 min). Unified as "announce pauses, ~1 minute max". Step 1 is now "read and restate" rather than mandatory reading aloud.
- Code bugs: the debrief score was always 0 (all-or-nothing), while the comment claimed 6. It now gives partial credit (5/12). The timer warnings never fired because of a case-sensitive match.
- Added: a section on **AI-free vs AI-allowed rounds (2026)**, two-problem rounds (Meta), and Pramp → Exponent. Toned down pop-neuroscience (amygdala, "blood flow") and the sleep claim; refreshed the history. Replaced the naming quiz question with an AI-round question.

## Unsure / worth a second look
- DORA "rework rate" (added in the 2024 report) and the "failed deployment recovery time" rename. Fairly confident, but not checked against the report.
- Git: SHA-256 "stable since 2.42" and "default in Git 3.0" are stated as plans. I did not verify whether Git 3.0 has shipped by Oct 2026.
- "Exponent absorbed Pramp", and GitHub Action major versions (v5 is current to my knowledge; v6 may exist).
- Meta two-problem format and company rubric names (Amazon LPs, Google, Meta) are described in general terms.
