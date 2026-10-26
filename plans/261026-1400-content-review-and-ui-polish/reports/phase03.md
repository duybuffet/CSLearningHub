# Phase 3 Content Review — Data Structures (11 topics)

How I checked: I extracted every JS example and ran it with Node 23. The examples that build on earlier classes were run in sequence. I compared every output claimed in a code comment against the real output. After the changes, all 11 files pass `node scripts/validate-content.mjs phase3/` with 0 errors and 0 warnings.

**Quiz answer positions (all topics):** before the review, almost every correct answer was option index 1 or 2, and options 0 and 3 were almost never correct. I swapped options so the correct answers are now spread evenly across 0–3 in all 11 files. No explanation refers to an option by its letter or position.

## arrays-linked-lists
- **Code bug:** `demonstratAmortisedCost()` was misspelled, so the example threw a ReferenceError. Fixed. The explanation now gives the real copy count (1023 for 1024 pushes).
- `insertAfter` was labelled "O(n) — must walk". It is O(1) when you already have the node. Fixed.
- Cache latencies were wrong ("L3 miss ~40 cycles"). Now: L1 ~4, L2 ~12, L3 hit ~40, DRAM 200+ cycles. Added the hardware-prefetcher point.
- Growth factors: any constant factor greater than 1 gives amortised O(1). Updated the numbers for CPython (~1.125×), Java (1.5×) and V8 (~1.5× + 16).
- Real-world list: removed "the JS event loop is a linked list" (wrong). Fixed "Redis eviction uses linked lists" (Redis samples keys instead). Fixed the claim that the CFS scheduler uses lists (it uses an rbtree; EEVDF has replaced CFS since Linux 6.6).
- Node memory estimate now mentions allocator and object-header overhead.
- q6: replaced a distractor that was arguably true ("the CPU cannot prefetch nodes").
- **Added:** a callout on how V8 stores arrays (elements kinds, holey/dictionary mode, typed arrays), plus a key takeaway.

## stacks-queues
- **Bug in the interview tip:** `n & (n-1) === 0` is wrong in JS because `===` binds tighter than `&`. Changed to `n > 0 && (n & (n - 1)) === 0` and explained why.
- "Swap the queue for a stack to get DFS": added the subtlety that DFS marks a node visited when it is popped, not when it is pushed. The example code already did this but the text said the only difference was shift vs pop. Updated q10's explanation to match.
- Go's goroutine scheduler is not a work-stealing deque of the kind described. Replaced with Java ForkJoinPool / Cilk.
- History: added Erlang (1909–17), Kendall (1953) and the B5000. Corrected the explanation of why the queue resets its tail.
- **Added:** a runnable sliding-window-maximum example using a monotonic deque. The pattern was described before but had no code.

## hash-tables
- **Diagram arithmetic was wrong:** 1234567 % 8 is 7, not 3, and 987654 % 8 is 6. The hash of 'alice' (×31) is 92903040, not 93029210, and 92903040 % 16 is 0. Corrected both diagrams.
- Birthday bound: "√(2m)" changed to the 50% point, ≈1.18·√m.
- Load-factor thresholds: replaced the flat "0.5 for open addressing" with 0.5–0.7 for linear probing, 2/3 for CPython, and 7/8 for Swiss tables.
- The rehash derivation (n + 2n + 4n… "after 2n more items") was confused. Rewrote it as 1 + 2 + … + n < 2n. Added incremental rehashing (Redis). Fixed q5's explanation the same way.
- **Hash DoS defence:** the old text said Java randomises its hash seed. It does not: `String.hashCode` is fixed, and Java 8+ turns overfull buckets into red-black trees (O(log n) worst case). The 7u6 alternative hash was removed in Java 8. Added SipHash (Python 3.4+, Rust, Ruby). Fixed q9 and the takeaway.
- Fixed the claim that "chaining is more common". In 2026 open addressing / Swiss tables are used by CPython, Rust, Abseil and Go 1.24+.
- Group anagrams is O(n·k log k), not O(n·k). Added the counting-key alternative.
- Map key equality is SameValueZero (NaN equals NaN). Added the power-of-two mask point and the `Math.abs(Integer.MIN_VALUE)` pitfall.
- Fixed the takeaway that said "objects in Java without hashCode violate the contract". The real violation is overriding equals without hashCode.
- **Added:** a section "How Real Runtimes Do It (2026)" covering Java HashMap treeification, CPython's compact dict, V8's ordered hash table for Map/Set, and Swiss tables.

## trees-heaps
- AVL vs Red-Black rotation claims were reversed or vague. Now: an AVL insert needs at most one single or double rotation, an AVL delete may need O(log n), and Red-Black needs at most 2 rotations per insert and 3 per delete.
- `sortedcontainers` is a list of sorted sublists, not a B-tree variant.
- Credited Floyd (1964) for the O(n) build-heap. Added that heap sort is not stable. Introsort is described as what `std::sort` uses.
- "JavaScript priority queues" do not exist. Corrected, and explained lazy deletion / decrease-key in Dijkstra.
- q10: the explanation now mentions that heapifying all n values also works, but it needs O(n) memory and cannot handle a stream.
- **Added:** a warning callout that JS has no built-in heap (and not to use sort-on-every-insert), plus a takeaway.
- All outputs verified, including the internal heap array `[1,3,2,5,9,8,7]`.

## graphs
- **q9 had two correct answers:** a tree is also bipartite. Replaced that option with "cycle graph C₇" and made the question say undirected.
- The definitions of DFS forward and cross edges were wrong. Fixed.
- **Kahn's algorithm:** the missing vertices lie on a cycle *or downstream of one*, not only on the cycle. Fixed in the text, the code comment, and q4.
- "CPU circuits are planar graphs" is false. "Google Maps runs Dijkstra" now says production routers add preprocessing such as contraction hierarchies. BFS history was fabricated ("1950s P2P networks"); replaced with Zuse 1945, Moore 1959, Lee 1961.
- The naive-BFS cost was given as O(V·E); changed to O(V²). The comment on the path output now matches what the code actually prints (A→B→D→F).
- Added that Bellman-Ford detects negative cycles, and qualified the A* complexity.
- **Added:** a runnable Dijkstra example with a small binary heap and lazy deletion (output verified), plus a takeaway.

## tries
- **Radix-tree diagram was wrong:** "internal" and "international" share "na" after "inter". Redrew it with the correct split.
- **History callout (the lead's item):** Morrison 1968 is PATRICIA, the compressed binary trie. TSTs come from Bentley & Sedgewick (SODA 1997, Dr. Dobb's 1998). Also noted that Linux moved from radix-tree.c to XArray in 2018. I checked the other names and dates in that callout (de la Briandais 1959, Fredkin 1960) and they are correct.
- Hunspell does not use a DAWG. Replaced with Scrabble engines and Lucene's FST.
- Overclaims removed or softened: "the entire Internet routes on a trie" (Linux uses an LC-trie; hardware routers use TCAM), "Google, GitHub and VS Code all use tries", "compiler symbol tables are tries", and an invented ">30% sharing" rule.
- The space rule of thumb was wrong. A naive trie is usually *bigger* than a Set of the same strings; you use one for prefix queries.
- "A BST can't do prefix queries cheaply" is wrong. A prefix query is a range query, O(k log n + m). Fixed.
- The "worst case is deterministic" claim is now qualified for Map-based children.
- **Added:** a takeaway on the real memory cost of tries.

## union-find-disjoint-set
- **α(n) thresholds** were inconsistent between the intro ("10^600"), the list, and q5 ("10^19728 digits"). Unified on α(n) = min k with A(k,k) ≥ n: values up to 3, 7, 61, then A(4,4) = 2^2^2^65536 − 3.
- **History:** the O(log* n) bound is Hopcroft–Ullman 1973, not Tarjan. Tarjan 1975 proved O(α(n)). Tarjan–van Leeuwen 1984 analysed the variants. Fischer's name was misspelled "Fisher". Noted that Fredman–Saks is a cell-probe lower bound.
- The iterative find in the code is path **halving**, but it was labelled path splitting. Defined both correctly.
- **The rank diagram contradicted its own caption.** Redrew it showing the bad merge (height 3) next to the good merge (height 2).
- "Union-Find beats DFS for cycle detection": on a static graph a single DFS is equally linear. The real advantage is handling edges online. Corrected "Number of Islands uses UF" (it is one possible approach).
- q8: the false-positive example (A→B, C→B) did not form an undirected cycle. Replaced with A→B, B→C, A→C.
- All outputs verified, including Kruskal (total weight 6) and the weighted DSU (6 and 1/6).

## balanced-search-trees
- **The Red-Black diagram was invalid:** the black-heights did not match (3 vs 4), and the caption said 6 keys when there were 7. Made 30 red and fixed the caption.
- **The B-tree diagram was invalid:** one child at depth 1 had no children, so leaves were at different depths. The caption also said "key 30 routes to C1 or C2". Simplified to a valid two-level order-4 tree with a correct caption.
- **B-tree capacity numbers contradicted each other** (8 million in the text, 1.6 billion in q7). Reconciled: 4 levels gives 200³ bottom nodes × ~200 keys ≈ 1.6 billion keys.
- Disk vs RAM speed was "10 million× slower"; corrected to ~100,000× and added NVMe figures. "300 ms = half a second" corrected to about a third.
- **"A B-tree range query needs one traversal per record" is false.** Rewrote the B+ vs B comparison around sequential leaf walks and fan-out, and updated q8 and the code explanation.
- Removed unsupported claims: "30% faster AVL reads", the AVL uses in compiler symbol tables, Gecko using AVL, and "Redis chose skip lists for concurrency" (Redis is single-threaded; the actual reasons were simplicity and rank/range queries).
- CFS → EEVDF (Linux 6.6) in the text, takeaways and q9. "2024" → "2026". Clarified the reason InnoDB secondary indexes store the primary key.
- q1 was ambiguous about whether height counts edges or nodes; it now asks for levels. q5 had a distractor that was arguably true; replaced it.
- **Added:** an info callout on LSM-trees as the write-heavy alternative to B+ trees.

## segment-and-fenwick-trees
- **`fromArray` was commented "O(n)" but was O(n log n).** Implemented the real O(n) build.
- The query diagram labelled v=3 as "recurse left only" and the caption said 5 nodes were visited. It is "recurse both" and 7 nodes. Fixed.
- The Fenwick diagram was missing bit[5]. Added it and explained that the diagram shows the update tree.
- "Complete binary tree" changed to "full". Clarified that the 4n allocation applies to the recursive layout and the iterative variant uses 2n.
- The persistent segment tree space was given as O(n log n); corrected to O(n + q log n). Corrected the Segment Tree Beats name.
- Overflow advice: JS numbers are exact up to 2⁵³; use BigInt only beyond that.
- Removed invented claims (RTS games, "buy/sell stock" as a segment-tree problem). Rewrote the time-series analogy as rollups. LIS now presents Fenwick as an alternative to patience sorting. Added Ryabko (1989).
- Fixed the complexity table: Fenwick does support range update (with a difference array, or two BITs).
- **Added:** a runnable lazy-propagation segment tree (range add plus range sum). It was described before but had no code. Outputs verified.

## bloom-filters
- **Code bug:** the two hashes (×31 and ×37 polynomials) were correlated, so the measured FPR was 1.5% at a 1% design point. **The experiment's claimed outputs were also wrong:** k=20 is ~7% not 35%, and 4 bits/element is ~26% not 20%. Replaced the hashes with well-mixed ones. Measured results now match the formula (1.0%, 26%, 7%, 3.5%), and the comments use the real numbers. While fixing this I hit the bug where `x | 1` returns a signed value, which gives negative positions; this is now called out in the explanation.
- **The crawler error direction was backwards.** A false positive makes the crawler *skip a new URL*; it never causes re-crawls. Fixed in the intro and the applications section.
- **Size arithmetic:** 1 billion URLs × 9.6 bits is about 1.2 GB, not 9.6 GB, so the saving is ~50×, not 5–10×.
- **Safe Browsing is outdated:** Chrome replaced its Bloom filter with a hash-prefix set, and current clients use prefix lists. Rewrote the section and q8.
- Bloom's original motivating example was hyphenation, not spell-checking. Fixed.
- "Cryptographic hashes are intentionally slow" is wrong; also noted the adversarial case and keyed hashes.
- Rewrote the made-up claims about cache stampedes, routers, and Netflix/Spotify. Replaced the stampede story with cache penetration. Noted that RedisBloom is bundled into Redis 8.
- **Added:** a section on how close Bloom filters are to optimal: the log₂(1/p) lower bound, the 44% gap, blocked Bloom filters, cuckoo, XOR/binary-fuse and ribbon filters, and union by OR. Plus a takeaway.

## lru-lfu-cache
- **The scan-resistance claim was inverted throughout** (text, diagram, q6, tip, takeaway). Sequential scans flush *LRU*; LFU resists them. Plain LFU's real weakness is popularity shift. Rewrote q6 around that (it previously had the wrong answer as correct).
- **Code bug:** an LRU with capacity 0 crashed because it evicted the head sentinel. Added a guard; verified.
- "O(1) worst case" changed to "expected O(1)", since Map/Set lookups are hashing. Applied to the code, the tip, and q7.
- Redis: there are 8 eviction policies (not 6), the default is `noeviction`, and its LFU uses a logarithmic decaying counter.
- PostgreSQL uses clock-sweep plus ring buffers, not LRU (`pg_buffercache` is just an inspection extension). Linux uses active/inactive lists and MGLRU. Memcached is multi-threaded.
- History: the "IBM System/370 hardware LRU" claim was dubious. Replaced with Bélády 1966 (MIN), Denning 1968, and Corbató's Clock (1968).
- The state diagram had a nonsense transition ("after eviction if cap=1"); removed it. The interview test case did not specify a capacity and could not tell correct from buggy code; replaced it.
- **Added:** a runnable Map-only LRU example and coverage of W-TinyLFU (Caffeine), ARC and 2Q.

## Uncertain / worth a second look
- The V8 growth formula (`old + old/2 + 16`) and the claim that the Node stack holds ~10k frames are from memory of V8 internals. Both are stated loosely.
- The Medium Bloom-filter example (recommendations) is a recollection of a public engineering post. Remove it if you want zero vendor claims.
- The Swiss-table adoption list (Rust hashbrown, Abseil, Go 1.24) and Redis 8 bundling RedisBloom are believed accurate as of 2026.
