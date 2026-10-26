# Content review: math-theory-compilers (phases 11–13)

15 topics reviewed. I ran every JS example with node and compiled the new TS example with `tsc --strict` (5.9). `node scripts/validate-content.mjs phase11/ phase12/ phase13/` reports **0 errors, 0 warnings**.
In every topic, quiz answer positions were spread across A–D by swapping options (before, most answers were "B"). Explanations that named options by letter were rewritten so they don't depend on position.
Two examples build on the one before them (graph [11] uses `g`, lexing [14] uses `lex`/`parse`). Each now says so in a comment, and both run correctly when combined with the earlier example.

## Phase 11

### logic-and-proofs
- Gauss-pairing "proof" was a long self-contradicting ramble (it ended up at "2S=(n+1)²?…") → rewritten as the clean 2S = n(n+1) argument.
- Quantifier code claimed `∀x ∃y: x+y=0` is true over -20..19, but it printed **false** (x=-20 has no partner) → made the domain symmetric and noted why the domain matters.
- The truth-table code printed rows F-first while its comment showed T-first → the code now prints T-first.
- The Ω(n log n) claim now says "comparison-based" sorting. The Gödel statement was made precise. Coq → Rocq (formerly Coq).
- **Added:** a rules-of-inference section (modus ponens/tollens, affirming the consequent, denying the antecedent, with debugging examples). Also added the "all horses same colour" induction pitfall and a takeaway.

### sets-relations-functions
- Intersection was likened to `INNER JOIN` → changed to `INTERSECT`. A join is a filtered Cartesian product.
- The "string equivalence in parsers … classes form non-terminals" claim was bogus → replaced with Myhill–Nerode.
- The Hasse diagram had a duplicate "2" node and arrows that contradicted the caption → redrawn bottom-up (BT) with only the covering edges.
- `x => x*3` was labelled a bijection ℤ→ℤ (it is not surjective) → now ℝ→ℝ, with a note about the domain.
- The "every SQL query = six relational-algebra ops" claim was overstated → it now covers bag semantics, aggregation, NULLs, and recursion.
- Other fixes: the Hasse cover definition is now strict (<), the topological-sort statement was made non-circular, ℚ enumeration is now the "zigzag" (not the diagonal argument), and a missing semicolon was added.

### combinatorics-counting
- "3,628,800 ways to seat ten people at a round table" → that number counts a row. A round table is 9! = 362,880.
- The derangement example crashed (`factorial` was not defined in the snippet) → fixed.
- **Quiz q3 had two correct answers** (367 people also guarantees 3 people share a birth month) → that distractor was replaced.
- q10 was a confusing "EXCEPT … always holds" trick question → rewritten.
- The compression-impossibility paragraph contained "…is false — wait" → rewritten correctly (2ⁿ inputs, 2ⁿ−1 shorter strings).
- The addition-principle example used overlapping sets → now separates disjoint and overlapping cases.
- The birthday bound was given as "√(2m)" → now ≈1.18√m for 50%, plus a 64-bit-ID example.
- Derangement history now credits Montmort (1708). The dubious "word entered English in 1940" claim was removed.
- **Added:** the stars-and-bars picture, the "at least one per bin" variant C(r−1,n−1), worked examples, and a takeaway.

### probability-for-cs
- **Karger's min-cut was listed as Las Vegas** → it is Monte Carlo (moved, with its success probability).
- The Chernoff bound was said to apply under pairwise independence → it needs mutual independence.
- The QuickSort code's comments claimed 29.24 / 943.53 → the actual outputs are 24.44 / 647.85. Added the exact closed form 2(n+1)Hₙ−4n. The "1.4 n log₂ n measured" claim was corrected: that is only the leading term.
- Two-word spam posterior: comment 0.9787 → 0.9763 (actual output).
- Smaller fixes: countable additivity stated properly, the `P(Ēc)` typo fixed, the geometric example now says uniform hashing rather than linear probing, Miller-Rabin is O(k log³n), and `Math.random` is now described accurately.
- Key takeaways were rewritten in Unicode (they used "Omega", "intersect") and now include the hashing/birthday numbers.

### graph-theory-basics
- The tree theorem was garbled ("three equivalent characterisations, any two of which imply the third") → it now states "any two of {connected, acyclic, n−1 edges} imply the third", plus the unique-path and minimal/maximal characterisations.
- The Euler/Hamilton code depended on `g` without saying so, and its comments said "Wait: … let's check" with wrong endpoints → cleaned up. The odd-degree vertices are B and C.
- Chromatic number was called "NP-complete to compute" → NP-hard (the decision version is NP-complete).
- The DFS topological-sort explanation was backwards → now reverse post-order.
- Other fixes: the Euler theorem now has the isolated-vertex caveat, the directed-graph condition was refined, and the Hamiltonian/TSP relationship was made precise.
- **Added:** Kₙ has n(n−1)/2 edges, Ore's theorem, Euler's formula V−E+F=2 ⇒ E ≤ 3V−6 (K₅ is not planar), and Held–Karp.

## Phase 12

### finite-automata
- **Pumping lemma typo `xyzⁱ ∈ L`** → `xyⁱz`. The proof obligation is now stated correctly ("every split"), and the lemma is labelled necessary but not sufficient.
- "Equivalent DFA requires 8 states" for (a|b)*abb → it has 4.
- "Myhill–Nerode proves the Pumping Lemma" → wrong; it is an exact alternative test.
- The ReDoS callout said the pumping lemma "flags" exponential backtracking → nonsense; replaced with the ambiguity explanation and the Stack Overflow 2016 and Cloudflare 2019 incidents.
- "Boyer-Moore is a DFA over prefixes" → that describes KMP.
- The complement construction needs a *complete* DFA (not "minimal").
- The palindrome example "abaⁿbⁿ" was garbled → fixed. Now notes that regular languages can count modulo k.
- The pipeline caption and the claim that "Rust regex does this at compile time" were corrected (lex/flex work at build time; RE2/Rust build lazily at runtime).
- Hopcroft vs Moore was clarified. Added .NET NonBacktracking and V8's experimental linear-time engine.

### regular-languages-and-regex
- The pumping demo crashed (`demonstreatePumping` typo) → fixed.
- "Regular languages predate the computer by a decade" → false; replaced with Kleene in the 1950s.
- Lazy DFA was attributed to Lex/Flex → it belongs to RE2/grep/Rust. Lex builds the full DFA at build time.
- Quiz q1's "Kleene's theorem" answer just restated the definition → it now states regex ⇔ finite automaton.
- Smaller fixes: Thompson's 1968 paper came a year before Unix (1969), RE2 supports no lookaround at all, `(.*a){20}` is polynomial (not exponential), and the made-up "redos-checker" was replaced with eslint-plugin-regexp / recheck.
- Possessive quantifiers don't exist in JS → added the `(?=(a+))\1` atomic-group workaround, verified in node.
- **Added:** a "ReDoS in the wild" warning callout (incidents, why Node's event loop makes it worse, defences in order).

### context-free-grammars
- **"Most production parsers — C, Java, Go — are LR"** → wrong for 2026. GCC, Clang, javac, Go, Rust, V8, and TypeScript all use hand-written recursive descent.
- "Go, Ruby, PHP parsers are LALR" → Go moved off yacc in 1.6, and Ruby 3.4 defaults to Prism. Only PHP/PostgreSQL still use bison.
- "PEG powers Rust, TypeScript" → wrong; CPython 3.9+ is the real PEG example.
- "Compilers rarely see more than a few hundred tokens" (as a reason CYK is fine) → removed.
- The JSON grammar was incomplete → completed.
- "HTML is a CFG" → HTML5 is defined by a parsing algorithm. XML is context-free.
- A garbled sentence on CFL intersection was fixed. The PDA diagram was missing n=0 acceptance → added.
- **Added:** Earley/GLR (tree-sitter), C's "lexer hack", and Peggy (the successor to PEG.js).

### turing-machines-computability
- **The TM simulator was wrong**: it ACCEPTED `001` and `0111` → replaced with a table-driven machine (tested on 7 inputs). The diagram and trace were redone to match it.
- **Key takeaway "co-HALT is neither RE nor co-RE"** → wrong: co-HALT is co-RE but not RE. Added TOTAL/EQ_TM as genuinely "neither" examples.
- "PCP reduces to HALT" → wrong direction; HALT reduces to PCP.
- The static-analysis example called **TypeScript "sound for types"** → TypeScript is intentionally unsound. The tool table was rewritten around the sound/complete/automatic trade-off, and the claim that proof assistants are "sound + complete" was corrected.
- The `runWithTimeout` example treated a thrown error as "did not halt" → replaced with a step-budgeted generator runner (including Collatz).
- Other fixes: the Entscheidungsproblem is about first-order validity, and Church got there first; the μ-recursive definition was completed; the von Neumann "independently" claim was softened.
- **Added:** Busy Beaver BB(5) = 47,176,870 (proved in 2024 and checked in Coq).

### complexity-classes-p-np
- The class diagram put NP-hard inside "Decidable" → redrawn (NP-hard includes HALT).
- The vault analogy for "beyond NP" was wrong, since a vault code is trivially verifiable → replaced with generalised chess (EXPTIME-complete).
- **Natural proofs: "one-way functions are a consequence of P ≠ NP"** → reversed; one-way functions would *imply* P ≠ NP.
- "2¹⁰⁰ > atoms in the solar system" → false (there are about 10⁵⁷ atoms); replaced with a time estimate.
- The strategy code had unreachable FPT logic and an unused parameter → rewritten and tested.
- The 2-SAT explanation (code comment + q4) was garbled → fixed.
- The factoring co-NP certificate was explained wrongly → fixed. "BQP = NP?" → "NP ⊆ BQP?".
- P = NP puts factoring in P *outright*, with a note that a "galactic" polynomial algorithm would not matter in practice.
- Smaller fixes: the Christofides improvement is from 2020 (44 years, not 47), AKS bound, 302 digits, Kissat/CaDiCaL, and "strongly NP-complete" now uses 3-Partition/TSP rather than 3-SAT.
- **Added:** a section on P ⊆ NP ⊆ PSPACE ⊆ EXPTIME, P ≠ EXPTIME, BPP, and co-NP-completeness, plus the reduction-direction rule in the tips and takeaways.

## Phase 13

### lexing-and-parsing
- "18 characters" → `const x = 1 + 2;` has 16.
- "CPython uses a hand-written recursive-descent parser" → it uses a generated PEG parser.
- "ESLint uses @babel/parser or acorn" → ESLint uses Espree (which is built on Acorn).
- PEG "can express indentation-sensitive syntax" → corrected (it can recognise aⁿbⁿcⁿ; whether PEGs cover all CFLs is an open question).
- Smaller updates: JS precedence-level count, PEG.js → Peggy, history (Knuth's LR in 1965, DeRemer's LALR, Naur), and the claim that "real parsers use LL(1)" (it now mentions arrow-function cover grammars).
- **Added:** a Pratt-parser example with binding powers, right-associative `**`, and unary minus (run and verified); notes on precedence climbing; a callout on JS lexer context-sensitivity (regex vs `/`, template `}`, ASI); the `-2 ** 2` SyntaxError; tree-sitter and TextMate highlighting; and two takeaways.

### abstract-syntax-trees
- **The callout correcting a "common mistake" was itself wrong**: `obj?.method()` is a `ChainExpression` in ESTree and an `OptionalCallExpression` in Babel (both verified with acorn and @babel/parser).
- "Babel uses ESTree" → Babel's AST deviates: StringLiteral/NumericLiteral, ObjectProperty, Optional* nodes.
- TypeScript's "type-annotated AST (symbol table)" → now describes the parser, binder (symbols), lazy checker, and emitter.
- Other fixes: Prettier does keep some original formatting (blank lines, expanded objects); Babel does not preserve formatting; black uses a CST and pylint uses astroid; dbt → sqlglot; the term "abstract syntax" is McCarthy's.
- **Added:** the Rust/Go tooling wave (SWC, Oxc, Biome, esbuild, Rolldown), source maps standardised as ECMA-426, and an ESTree-vs-Babel takeaway.

### interpreters-and-compilers
- **"V8 uses a tree-walk interpreter for tiny scripts"** → false. The V8 tiers are now **Ignition → Sparkplug → Maglev → TurboFan** in the intro, the diagram, the runtime section, and the takeaways (it previously said "two-tier" in one place and "three tiers" in another). I mentioned the Turboshaft migration without pinning a date.
- CPython "no JIT as of 3.12" → updated: specialising interpreter (3.11), experimental copy-and-patch JIT (3.13), included but off by default in the 3.14 binaries.
- The Lua paragraph contradicted itself (it said Lua was tree-walking up to 5.1 and that 5.0 introduced a VM) → fixed; Lua has always used bytecode.
- Other fixes: Android runs DEX rather than `.class` files, ART is a hybrid JIT plus profile-guided AOT, "multi-GB JVM code caches" is wrong (about 240 MB by default), JITs now use W^X too, the `rustc --release` flag is actually a cargo flag, and the JIT history (Smalltalk-80, Self → HotSpot → V8) was corrected.
- Overclaims were toned down (JVM "matches C", JIT "matches or exceeds AOT").
- **Added:** a bash example with real `--print-bytecode`, `--trace-opt`/`--trace-deopt`, and `--jitless` output from Node 23, showing Maglev, a "not a Smi" deopt, then TurboFan.

### type-systems
- **"`const x = 'north'` gives `x: string`"** → wrong; it gives `'north'` (`let` widens). Checked with tsc.
- "Generics added … to C# *earlier* in 2005" → fixed; also added C# reified vs Java erased generics.
- "Java and Go are nominal" contradicted a takeaway that called Go interfaces structural → now explains that Go mixes both.
- The "15–38% of bugs" figure was mashed together → now cites Gao et al. (2017, 15%) and Airbnb's estimate (38%) separately.
- The claim "unsoundness is only in escape hatches" → it now also lists the built-in unsound features: method bivariance, unchecked indexing, and array covariance.
- Rust is now described as HM-style inference inside function bodies only.
- Gradual typing nuance added. Soundness definition now includes Milner's slogan and progress + preservation, and what soundness does *not* cover.
- **Added:** a TypeScript example showing 4 unsoundness holes. It compiles under `--strict` and every marked line crashes at runtime (verified). Also added `never` exhaustiveness checking and Node's type stripping.

### programming-paradigms
- The Cart example's comment claimed subtotal 384.93 and total 377.51 → it actually prints 383.93 / 373.18 (now rounded for display). The `$360.81` comment → it prints $360.70.
- "npm uses a SAT solver" → false; now names libsolv (DNF/zypper/conda) and PubGrub (pub/uv).
- "A closure captures the value at creation" → JS closures capture variables (bindings), not values.
- The "banana–gorilla–jungle" quote was misattributed to LSP violations → corrected to Joe Armstrong's point about coupling.
- "Kubernetes is built around OOP controllers" → replaced.
- Other fixes: the "impure shell" typo → "functional core, imperative shell" (Gary Bernhardt), CodeQL added under Datalog, `Array.find` as a "logic idea" → pattern matching/destructuring, and letter references removed from the q1/q9 explanations.

## Unsure / worth a second look
- The CPython 3.14 JIT wording ("included in official Windows/macOS binaries, off by default"). I'm confident about 3.13/3.14 but did not check anything later.
- The V8 Turboshaft migration is described loosely ("has been moving"), which is deliberate.
- The JS precedence-level count is given as "roughly 18–20" because sources count it differently.
- Quiz option swaps sometimes break a natural numeric order of options (e.g. 8/12/16/32). Each question still has a single correct answer.
