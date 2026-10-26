# New topics: Phase 2, week 5 ("Building Abstractions")

Three new files. Each has 23 sections, 10 quiz questions and `visualizer: none`. All three pass `node scripts/validate-content.mjs functions-scope object-oriented garbage-collection` with 0 errors and 0 warnings. I also parsed every Mermaid diagram (13 in total) with the repo's mermaid@11.16 and all of them parse. Every code block was pulled back out of the final JSON and run with Node 23.11, and the outputs match the comments.

| File | Diagrams | Code examples | Quiz answer positions |
|---|---|---|---|
| `src/content/phase2/functions-scope-closures.json` (icon `code`) | 4 (scope chain, TDZ state, var/let loop bindings, `this` decision) | 4 JS | B C A D B C A D B C |
| `src/content/phase2/object-oriented-programming.json` (icon `pattern`) | 5 (pillars, class diagram for inheritance vs composition, polymorphism kinds, prototype chain, method-lookup sequence) | 3 JS + 1 TS | B C A D C A D B C D |
| `src/content/phase2/garbage-collection.json` (icon `memory`) | 4 (reachability graph, tracing strategies, generational lifecycle, tri-color states) | 4 JS | B C A D B A C D B A |

## Functions, Scope & Closures
- **Covers:** functions as values (comparison table of declaration, expression and arrow), parameters vs arguments (defaults fire only for `undefined`, `fn.length`, Python's mutable-default trap), and call-by-sharing compared with true pass-by-reference in C++ and C#.
- **Also covers:** lexical vs dynamic scope (Bash, Emacs Lisp), var/let/const with a TDZ table, hoisting, how closures work (environment records, V8 Context objects), and the loop bug with both the `let` fix and the IIFE fix.
- **Comparisons:** closure capture rules in Python, Java, C++, Rust and Go. Go fixed the loop-variable bug in 1.22.
- **Practical patterns:** memoize, private state, partial application, curry, and the four `this` rules plus arrow functions.
- **Rest of the chapter:** higher-order functions and pure functions (iterator helpers ES2025), closure memory leaks (including `AbortController` cleanup), a common-mistakes callout and an interview checklist.
- **Code:** call-by-sharing and parameters; hoisting and TDZ; closures (counter, loop bug, memoize, partial, curry); `this` rules plus a filter/map/reduce chain.

## Object-Oriented Programming
- **Covers:** objects and classes, encapsulation (comparison of `_x`, TS `private`, closures and `#private`; `#x in obj` brand checks), inheritance (LSP, single vs multiple inheritance, C3 MRO, Go/Rust have no class inheritance) and composition over inheritance (GoF, Bloch's example, mixins).
- **Polymorphism:** subtype, ad-hoc and parametric, with notes on erasure vs monomorphisation. Also abstraction: interfaces, abstract classes, and structural vs nominal typing with branded types.
- **Prototypes:** what `new` does in four steps, `class` as sugar plus the ways it is more than sugar, method resolution (vtables, Python MRO, V8 hidden classes and inline caches).
- **Forward pointers only:** SOLID (phase 10), design patterns (phase 9) and paradigms (phase 13) are pointed to briefly and not repeated.
- **Code:**
  - `#private` bank account.
  - Fragile base class with a real `Set` subclass. The `Set` constructor calls the overridden `add()` before the subclass field initialiser resets the count, which shows the problem for real.
  - TypeScript interfaces, overload signatures and generics. It runs with `node file.ts` and was also type-checked with `tsc --strict`.
  - `class` vs a hand-written prototype chain.

## Garbage Collection & Memory Management
- **Covers:** manual vs automatic memory management (the ~70% memory-safety vulnerability figure from Microsoft and Chromium), roots and reachability, reference counting (CPython RC plus cycle collector, free-threaded biased RC, Swift ARC with `[weak self]`, `shared_ptr`/`Rc`), and mark-sweep vs mark-compact vs copying (with a comparison table).
- **Also covers:** the generational hypothesis with remembered sets and card tables; stop-the-world, parallel, incremental and concurrent collection; tri-color marking with Dijkstra, Yuasa/SATB and hybrid barriers.
- **Runtimes:** V8 Orinoco (parallel Scavenger with promotion after two survivals, concurrent marking, parallel compaction, concurrent sweeping, idle-time GC, `--max-old-space-size`, `--trace-gc`), the JVM (G1, ZGC, Shenandoah, Parallel, Serial) and Go (GOGC, GOMEMLIMIT, Green Tea).
- **Alternatives and weak references:** Rust ownership and borrowing. WeakMap, WeakRef and FinalizationRegistry, with Java `finalize()` deprecated for removal (JEP 421).
- **Leaks:** common JS leaks, and finding them with heap snapshots (the three-snapshot method, retainers, the Node snapshot flags).
- **Code:**
  - Toy heap comparing reference counting with mark-sweep on a cycle.
  - Incremental tri-color marker that frees a live object unless a write barrier is used.
  - WeakRef / WeakMap / FinalizationRegistry, run with `--expose-gc`. I ran it 6 times and the output was the same each time. The text notes that the spec does not guarantee when finalizers run.
  - Measured leak vs fix: an unbounded Map plus listeners retains about 42 MB; an LRU cache plus unsubscribing retains about 0.1 MB.

## Things to note / unsure
- **Go 1.26 Green Tea default:** the text says Go 1.26 (Feb 2026) made the Green Tea GC the default (it was experimental in 1.25). I'm fairly sure, but it is the newest fact here — please check it against the Go 1.26 release notes.
- **JVM status:** described as of JDK 25 LTS. Generational ZGC became the default mode in JDK 23 and the only mode in JDK 24; generational Shenandoah became a product feature in JDK 25. I'm confident about these, but they are dated facts.
- **Node TS type stripping:** the text says it is on by default since Node 23.6 / 22.18 and supports erasable syntax only. The TS example avoids parameter properties and enums because strip-only mode rejects them (I checked this).
- **Mermaid note syntax:** the brief's "`note ... end note`" rule does not work in `sequenceDiagram`, where it is a parse error. I used a single-line `note right of A: ...` there. The lead may want to fix that line in the brief.
- **WeakRef example:** if the payload is created at top level instead of inside a function, Node 23 did not run the finalizer in my tests. The example creates it inside a function for that reason.
