# Content review — phase04 (Algorithms)

Scope: all 12 topics in `src/content/phase4/`. Every JS `code_example` / `code_concept` (and fenced JS blocks) was extracted and run with Node 23; new and rewritten code was tested on edge cases (and fuzzed against brute force where noted). Final check: `node scripts/validate-content.mjs phase4/` → **12 topics, 0 errors, 0 warnings**.

Cross-cutting fix: in 10 of 12 quizzes, 7–9 of 10 answers were the same option (usually B). Options were swapped so answers are spread; explanations that cite option letters were kept consistent.

**Uncertain / worth a second look**
- V8 `indexOf` strategy (linear → Boyer-Moore-Horspool → Boyer-Moore): from memory of V8's `string-search.h`; I'm fairly confident, but it isn't documented behaviour.
- Binary-search history (Lehmer 1960 / Bottenbruch 1962 / Pattis 1988 "most of 20 textbooks"): taken from the commonly cited sources; I kept the wording deliberately hedged.
- Kozen–Zaks canonical-coin bound, phrased loosely as "any counterexample is smaller than the sum of the two largest coins".
- Mermaid: every diagram passes the project validator. I couldn't run the real mermaid parser headless (it needs DOMPurify and a DOM), so the edited diagrams were checked by hand against the brief's syntax rules.
## sorting-algorithms
- Code bug: two-pass stable sort example claimed `Alice, Bob / Carol, Dave`; stable result is `Bob, Alice / Dave, Carol` (verified with node) → fixed comments, added single-comparator idiom.
- Code bug: quicksort claimed "tail recursion on smaller partition bounds stack to O(log n)" but made two real recursive calls (worst-case O(n) depth; JS has no TCO) → rewrote as recurse-smaller + loop-larger; explanation updated.
- Code bug: merge-sort "stability demo" compared objects with `<=` and never printed anything → added comparator param and a printed demo (`lint, compile, test, deploy`).
- Fact: "JS/Python/Java all use TimSort" → V8 uses TimSort; spec only mandates stability (SpiderMonkey/JSC use merge sorts); V8 switch dated 2018 (V8 7.0), not 2019; CPython 3.11 Powersort note.
- Fact: "ES2019 stable sort 30 years after JS" → 24 years (1995).
- Fact: "quicksort achieves the bound" → worst case only merge/heapsort; random-pivot probability "1/n!" → expected O(n log n), ~2ⁿ⁻¹/n!.
- Fact: takeaway said quicksort uses O(1) extra space → O(log n) stack. "Stability has zero effect on speed" → nuanced (stable n log n sorts pay O(n) buffer).
- Quiz q7: option C (single comparator) was also correct, as the explanation admitted → reworded question to two-pass, replaced options so only B is right. q6: wording on TimSort/ES2019.
- Added: Heapsort + Introsort/pdqsort/dual-pivot section, complexity row for heapsort; warning callout on JS default string sort / boolean comparator / `toSorted()`; 2 takeaways.

## binary-search
- Code bug: `mySqrt(0.25)` printed 0.625 (claimed 0.5) because window started at [1, x]; absolute 1e-9 epsilon also loops forever for large x → window [0, max(1,x)], fixed 100 iterations; explanation updated.
- Quiz q6: marked answer was wrong ("mid=2,4,3") and explanation was a rambling self-correction → correct is "mid=2, mid=3"; clean explanation. q4 explanation: infinite loop occurs when lo == hi.
- Fact: max iterations ⌈log₂ n⌉+1 → ⌊log₂ n⌋+1 (matches the table).
- Fact: B-tree "30 node accesses" → 3–4 node/page reads, ~30 key comparisons total.
- Fact: "allocators binary-search a sorted free-list" (and odd `brk` mention) → size-ordered bins/trees; linked lists can't be binary searched.
- Fact: Java bug "discovered by Frank Yellin" → Joshua Bloch's 2006 post; overflow threshold ~2³⁰ elements; `>>> 1` idiom; JS `>>>1` safe vs `>>1` unsafe.
- Fact: 32-bit index claim for Go/Rust → Java/C int-index specific.
- Fact: history (Lehmer 1960 / Bottenbruch 1962; Bentley's ~10%; Pattis 1988) corrected; intro "a decade" contradicted "sixteen years".
- Fact: recursion callout said recursive calls aren't tail calls → they are; the real issue is V8/SpiderMonkey don't implement TCO.
- Added: rotated sorted array search + find-min code example (exhaustively tested), note that JS has no built-in binary search; 1 takeaway.

## dynamic-programming
- Diagram bug: memoised fib(5) tree marked the wrong calls as cached (with fib(n-1)-first evaluation, fib(4)'s subtree computes and fib(5)'s fib(3) is the hit) → redrawn.
- Diagram bug: coin-change [1,3,4] table had wrong values (dp[4]=2, dp[5]=3 "or 3+2?", dp[7]=3) → redrawn with correct dp[4]=1, dp[5]=2, dp[7]=2, dp[8]=2.
- Numbers: "fib(40) over a billion calls / memo exactly 40 (41) calls" → 331,160,281 naive calls; memo 79 calls (41 distinct values) — measured with node.
- Fact: "greedy always fails when coin system is non-canonical" → canonical = greedy optimal for every amount; non-canonical fails for some amounts.
- Fact: bitmask TSP O(2ⁿ·n) → Held–Karp O(2ⁿ·n²) time, O(2ⁿ·n) space. Analogy's "ways(38) computed by ways(38)" nonsense fixed. "2–5× faster" claim softened; added memo-vs-tab reachable-states trade-off. Knapsack state "exactly at most w" typo.
- Quiz: 8/10 answers were option B → rebalanced positions (now 1,0,3,2,0,3,2,1,2,0).
- Added: LCS-with-reconstruction + rolling-row edit distance code example (tested: BCAB/4, kitten→sitting 3); O(n log n) patience-sorting LIS; 1 takeaway + LIS note.

## greedy-algorithms
- Broken prose: the 0/1-knapsack counterexample paragraph was a stream of failed attempts ("wait… Actually… Same here…") → replaced with the CLRS example (cap 50: greedy 160 vs optimal 220, verified).
- Fact: "canonical = each coin a multiple of the previous" (US coins: 25 isn't a multiple of 10) → canonical = greedy optimal for every amount; divisibility is sufficient not necessary; Kozen–Zaks / Pearson test mentioned.
- Fact: matroid callout claimed activity selection and Huffman are matroid problems and that greedy works "iff" matroid → Rado–Edmonds stated precisely (all weight functions); intervals aren't a matroid (counterexample given); matroids sufficient, not necessary.
- Fact: OSPF "used throughout the internet / every packet" → OSPF/IS-IS inside networks; BGP between networks. "LZ77/LZ78 modern formats" → DEFLATE = LZ77 + Huffman; Brotli/zstd notes.
- Fact: "minimum platforms ≡ activity selection" → it's interval partitioning (different greedy).
- Diagrams: activity trace skipped G → added; Dijkstra node labels showed stale distances (4, 7) contradicting caption → "4 then 3", "7 then 6" with full caption trace.
- Code: activitySelection crashed on empty input → guard. Edge case "zero-duration activities all get selected" → corrected. Huffman explanation claimed O(log n) heap ops while toy heap re-sorts → clarified.
- Quiz: 8/10 answers were B → rebalanced (0,2,3,2,0,2,3,2,1,0).
- Added: interval partitioning (min meeting rooms) + Jump Game code example (tested); takeaway on canonical coins/matroids; CLRS numbers in knapsack takeaway.

## divide-and-conquer
- Fact: Strassen "5× faster at n=1000, 15× at 10,000" → theoretical op ratio n^0.193 is ~3.8× / ~5.9× before constants; cutoffs and BLAS practice explained; diagram label fixed. Matrix-mult exponent updated (≈2.371 as of 2024).
- Fact: master theorem caveats — log factors ARE covered by extended case 2 (Θ(n^d logᵏ⁺¹ n)); added T(n−1)+O(n) and unequal-split limits, Θ tightness, tree-traversal example.
- Fact: history — "binary search described even earlier, by Lehmer in 1946" → Mauchly 1946 (Lehmer 1960); "term traces to von Neumann" → merge sort credited to von Neumann.
- Fact: parallel merge sort "near-linear speedup up to p = n/log n" → serial merge limits parallelism to O(log n); with parallel merge Θ(n/log² n). TCO advice → JS doesn't do TCO; recurse-smaller/loop-larger.
- Fact: merge "exactly n comparisons" → at most n−1; in-place merge complexity claim corrected.
- Diagram/code mismatch: recursion tree split [5,2,8] as [5,2]/[8] but code splits floor(n/2) → [5]/[2,8]; redrawn. Code trace comment said "right exhausted" (it's left) and "run in parallel" → fixed.
- Quiz: 9/10 answers were B → rebalanced. q10 explanation clarified (O(n log n) allocated total vs O(n) peak).
- Added: Karatsuba BigInt code example (verified against native `*`), quickselect in-place note, 2 takeaway extensions.

## backtracking
- Numbers (measured with node): 8-Queens tree has 2,057 nodes / 15,720 column checks (text called 15,720 "nodes"); n=12 claimed "12^12 ≈ 8.9 billion, ~261,000 nodes" → 8.9 *trillion*, ~856,000 nodes (~10M checks).
- Diagram/text bug: n=4 trace said col 3 in row 1 is pruned by a diagonal → it's valid (diagonals −2/4 free); garbled walkthrough rewritten; "of 8 choices at row 0 only 6 survive" → refers to row 1 (6 or 5 survive).
- Template: goal check before invalid check could record an invalid state → invalid-first in text, pseudocode, flow diagram, common-mistakes and takeaway; q9 distractor that became a real bug replaced.
- Fact: complexities (n·n!, n·2ⁿ; N-Queens isn't "output has n! items"); sudoku 9^81 "cannot be printed" / "<100 nodes for hard puzzles" softened; MRV "fails 50%" reworded.
- Fact: history — DPLL → modern CDCL solvers; DLX attribution clarified; Walker/Golomb–Baumert.
- Quiz: 8/10 answers were B → rebalanced.
- Added: subsets-with-duplicates + Word Search (grid choose/unchoose) code example (tested), 1 takeaway.

## shortest-path-algorithms
- Wrong counterexample: "A→B 2, B→C −5, A→C 1 → Dijkstra returns dist[C]=1" is false for the article's own lazy-deletion code (it overwrites C to −3). Rewrote with A→B 2, A→C 1, B→C −5, C→D 1: code returns D = 2 vs correct −2 (verified by running it); removed the "Actually… happens to give the right answer!" ramble; note on label-correcting variant.
- Quiz q9: option said "About 600x" but explanation computed 288x → option now "about 300x".
- Fact: Bellman-Ford round-k invariant stated precisely ("no worse than best ≤k-edge path"); V-th round only detects cycles reachable from source (virtual-source trick).
- Fact: `dist[u] !== Infinity` guard — harmless in JS; real issue is INT_MAX sentinels in Java/C++.
- Fact: Johnson's "useful where V² < VE" → beats Floyd–Warshall on sparse graphs; SPFA worst case can be forced; "Google Maps uses CH" softened to route planners generally (OSRM/GraphHopper/CRP).
- Text: "five-vertex graph" → four; Dijkstra negative-weight paragraph rewritten (it was garbled).
- Quiz positions rebalanced (explanations referencing option letters kept consistent).
- Added: DAG shortest paths (topological order, O(V+E), negative weights OK) code example; BFS / 0-1 BFS in decision list; takeaways updated.

## minimum-spanning-tree
- Fact: "STP is essentially Prim's algorithm run distributedly" → STP builds a shortest-path tree to the root bridge, not an MST; GHS (1983) named as the real distributed MST.
- Fact: Kruskal correctness cut defined as "(component of u, component of v)" → (component of u, everything else) with a correct "no lighter edge crosses" argument.
- Fact: "Fibonacci-heap Prim is theoretically optimal" → best bound for Prim only (Chazelle, Karger–Klein–Tarjan faster). "Best possible comparison-based" union-find → Fredman–Saks cell-probe lower bound.
- Fact: history — Tarjan's α bound is 1975 (not 1984); Jarník/Prim/Dijkstra attribution; Christofides needs metric TSP.
- Precision: cut property with ties ("a lightest edge belongs to some MST"); swap proof completed.
- Diagram: undirected graph drawn with directed arrows → undirected links.
- Quiz q10 explanation arithmetic garbled → "|C| − 1 per component, V − k total".
- Added: cycle property; Borůvka's algorithm section (+ table row); MST minimax/bottleneck-path property; 1 takeaway + extensions.

## topological-sort
- Code bug (both implementations): vertices that appear only as neighbours (no key) crashed Kahn (`graph[u]` undefined → TypeError) and were silently skipped by DFS (color undefined) → all vertices registered, `graph[u] ?? []`; regression line added (`{A:['B']}` → ['A','B']).
- Code bug: Kahn used `queue.shift()` (O(n) in JS → O(V²)) while claiming O(V+E) → head index.
- Code/output mismatch: DFS example claimed `Calculus, Linear Algebra, Intro CS, …`; actual (and the article's own trace) is `Intro CS, Data Structures, Calculus, Linear Algebra, Algorithms` → fixed.
- Quiz q6: explanation claimed "D and E become ready after C" and "at least four" → D can come right after B; there are exactly 7 orders (enumerated with node). q4 explanation clarified with concrete pre-order counterexample; q8 PQ complexity O(V log V + E).
- Fact: "out-degree-0 vertex always appears at the end" → can be placed last; Kahn progress argument fixed ("each step eliminates an edge" isn't true); back edge is not a tree edge.
- Fact: "package managers reject circular dependencies" → npm tolerates them (Cargo rejects); SCC condensation; compiler data-flow uses reverse post-order; Tarjan 1976 attribution.
- Quiz positions rebalanced (9/10 were B).
- Added: Kahn-by-levels (parallel rounds / critical path) code example (tested), 1 takeaway.

## string-matching-algorithms
- Code bug: Rabin-Karp mapped chars with `charCodeAt - 96`, making uppercase/space codes negative; the rolling update then disagreed with the direct hash and real matches were missed (`rabinKarp('Hello World','World')` → `[]`, verified). Rewrote with `charCodeAt + 1`, BASE 131, explicit 2⁵³ safe-integer reasoning; fuzz-tested 3,000 random cases vs brute force.
- Code bug: `rabinKarpMulti` was a placeholder that returned the hash map (and a Map<hash, pattern> that drops colliding patterns) → complete one-pass implementation with hash → pattern list.
- Diagram bug: naive-search trace used text "ABCABDABCABD", which matches ABCABD at i=0, yet showed a failure there → text changed to "ABCABCABD"; caption corrected.
- Formula typo: rolling-hash update had unbalanced parentheses.
- Fact: KMP history (Morris 1970; Knuth & Pratt independently; joint 1977). grep "Boyer-Moore-Horspool + Aho-Corasick", "VS Code uses similar", Turnitin rolling-hash, Dropbox dedup, "exactly how antivirus works" → corrected (Boyer-Moore variant/Commentz-Walter, ripgrep/Teddy, winnowing/MOSS, rsync & content-defined chunking, AV mostly Aho-Corasick).
- Fact: added adversarial-collision caveat (fixed public base) and randomised base/double hashing; decision caption no longer calls KMP the production default.
- Takeaway bug: "bounding the naive loop at n−m rather than n" was backwards → fixed.
- Quiz positions rebalanced; q8 explanation mentions Aho-Corasick.
- Added: Boyer-Moore/Horspool, Z-algorithm, and what V8's `indexOf` does (section); 1 takeaway.

## bit-manipulation
- Code bug: `packRGBA(...).toString(16)` printed `-55cc78`, not the claimed `ffaa3388` (bit 31 set → negative int32) → `>>> 0` on the packed result; explanation shows the failure.
- Code bug: Kernighan popcount / Hamming distance looped `while (n > 0)` → returns 0 for any value with bit 31 set (`popcount(-1)` = 0) → `n |= 0; while (n !== 0)`; verified against brute force on 100k random uint32s.
- Wrong trick: "contiguous run iff `(m & (m+1)) === 0`" rejects 0b00111000; C `__builtin_ctz` in JS context → correct `((m + (m & -m)) & m) === 0` (tested).
- Comment/output mismatches: `(a ^ b).toString(2)` is '110' not '0110'; `clearBit` → '10'; `extract` → '11'.
- Fact: "bitwise ops single cycle, difference is enormous" → same cost as add; compilers already strength-reduce. "Popcount single-cycle since Sandy Bridge / Cortex-A15" → POPCNT since Nehalem/Barcelona; JS has no popcount builtin. SWAR popcount "~5 operations" → ~12 (and added the code). Kernighan's trick predates K&R (Wegner 1960).
- Fact: "`Math.min(int32)` negated stays negative" nonsense → INT_MIN negation example; C++20/C23 mandate two's complement; `>>` floors for negatives vs truncating division.
- Added: `1 << 31` is negative, BigInt bitwise ops (no `>>>`, `asUintN`, no mixing), 32-bit field mask caveat, XOR-swap "prefer destructuring" note, SWAR popcount code; 1 takeaway + extensions.
- Quiz positions rebalanced (were mostly B/C).

## math-for-algorithms
- Quiz q2: marked answer claimed "a mod b is always at most half of min(a,b)" (false: 8 mod 5 = 3) and credited this to Lamé → correct statement (a mod b < a/2) with proof; Lamé's bound stated properly.
- Diagram/text: a^13 "4 squarings + 3 mults = 5 operations" inconsistent → 3 squarings + 2 real multiplies (q6 explanation fixed too). Sieve trace said p=3 marks only 9,15 → 9,12,15,18 as the code does.
- Fact: "Uint8Array halves memory" / "10^8 sieve: 100 MB… halves this to 100 MB" → 4–8x vs regular arrays; 100 MB / 12.5 MB bitset / segmented.
- Fact: sieve "≈16 million ops, a few hundred ms" → measured ~23M cross-outs, ~40 ms in Node.
- Fact: gcd(0,0) "undefined" → conventionally 0 (Python/C++); √n-bound argument rewritten (was garbled); tiling analogy step wrong ("three 36×12 strips").
- Fact: RSA primes come from "sieve ideas" → Miller–Rabin on random 1024-bit candidates; LCG modulus note + Math.random/crypto.getRandomValues.
- Fact: 10^9+7 "fits in int" → also the *sum* of two residues fits int32 (the real reason).
- Added: Extended Euclid + general modular inverse code (tested: 240/46, inv(3 mod 10)=7, no-inverse error), BigInt `**` pitfall, BigInt speed note, linear-sieve note in q4; 1 takeaway + extension.
- Verified: 2^(10^9) mod (10^9+7) = 140625001 and C(100,50) mod p = 538992043 against Python.
- Quiz positions: added two index-3 answers.
