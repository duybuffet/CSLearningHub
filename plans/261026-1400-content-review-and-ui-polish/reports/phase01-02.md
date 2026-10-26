# Content review — phase01-02

Scope: the 7 files in `src/content/phase1/*` plus `phase2/{memory-stack-heap,recursion,big-o-complexity}.json`.
I ran every JS code block in Node 23 and checked the outputs claimed in comments. Validator result: `node scripts/validate-content.mjs phase1/ phase2/` gives 13 topics, 0 errors, 0 warnings.
Quiz answer positions were spread across A–D in 9 of the 10 files (binary-and-bits was already spread), with options swapped rather than reworded.

## phase1 / binary-and-bits
- Wrong: "each transistor encodes exactly one bit". Fixed: SRAM uses about 6 transistors per bit, DRAM uses 1 transistor plus a capacitor, and flash cells store 2–4 bits each (MLC/TLC/QLC).
- Wrong: 42 written as `0101010` (7 bits). Fixed to `101010` / `00101010`.
- Fixed "CSS display flags" (not a bitmask) by replacing it with real examples: `O_WRONLY|O_CREAT` and WebGL masks.
- Fixed the overflow claim "Rust wraps unsigned". Rust panics in debug builds and wraps in release. Also added Java, Go and Python behaviour.
- Updated units: Windows shows GiB but labels it "GB", and macOS uses decimal units. The 64-bit address space is in practice 48 or 57 bits. Corrected the data-size examples (4K movie, genome).
- Changed the diagram to KiB/MiB/GiB. Clarified the q9 explanation (address space vs. bus width).
- Added a caveat that JS bitwise operators work on 32-bit signed integers (`1<<31` is negative), with BigInt as the alternative, plus a takeaway for it.

## phase1 / logic-gates-boolean-algebra
- **Code bug:** `add4bit(15,1)` printed `16`, but the comment said `0`. Fixed so the result keeps only 4 bits and the carry is reported separately.
- Wrong: "two transistors in series = AND gate (CMOS)". Rewrote the physical section: series/parallel = AND/OR only in the relay/switch model. Real CMOS gates are inverting: NAND is 4 transistors, AND is 6. Also fixed "power only while switching" (leakage matters now) and MOSFET terminal names.
- Wrong: "chips are built from NAND cells only". Fixed: real chips use standard-cell libraries; NAND universality is a theoretical guarantee.
- Fixed "ripple carry is how CPUs added for decades". Added carry-lookahead and parallel-prefix adders: O(log n) vs O(n) delay.
- Fixed the claim that short-circuit evaluation is like gate cascading (hardware gates never short-circuit). Added the aliasing caveat for XOR swap.
- **Added:** a section on combinational vs. sequential logic (SR latch, D flip-flop, registers, SRAM, critical path), plus a takeaway.

## phase1 / cpu-fetch-decode-execute
- Fixed latency numbers: an L1 load is about 4–5 cycles, not 1. Added the full L2/L3/DRAM ladder; MUL is about 3–4 cycles and DIV 10–40+.
- Fixed "ALU only operates on registers" to distinguish load/store ISAs from x86 memory operands (which become micro-ops). Microcode is used only for complex instructions.
- Clock: the frequency comes from a crystal plus a PLL. Fixed "old CPUs had CPI=1" (they were multi-cycle). The clock plateau is now explained by the end of Dennard scaling; boost clocks reach about 6 GHz in 2026.
- Updated the ISA landscape for 2026: Apple Silicon, Graviton, Axion, Cobalt and Snapdragon X; ARM's origin as Acorn RISC Machine; MIPS moving to RISC-V.
- Pipelining: the 5x gain is the ideal case, and pipelining improves throughput, not latency. Hazards now cover the **load-use stall even with forwarding** and **WAR/WAW hazards handled by register renaming**. Peak width is 6–10 instructions per cycle; real IPC is about 1–4.
- Fixed a diagram caption that claimed instructions complete in cycle 4. Cleaned up the hacky STORE in the simulator.
- Tips: function calls are well predicted by the return stack buffer and don't flush the pipeline. Branchless code only wins on unpredictable branches.
- **Added:** an interrupts/exceptions/syscalls section, plus a takeaway.

## phase1 / memory-hierarchy
- Wrong: registers listed as "2–4 KB"; 32 × 8 bytes is a few hundred bytes. Fixed, and noted vector and physical registers separately.
- Updated all latency and size ranges to 2026 hardware: L1 about 1 ns (32–128 KB), L2 1–3 MB, L3 8–128+ MB, DRAM about 70–120 ns (300–500 cycles), NVMe 20–100 µs. Also fixed the "L1 = 1 second" analogy, the callout and the takeaways. DRAM had been listed as "microseconds"; now about 100 ns.
- Wrong: "64-byte cache lines everywhere". Fixed: Apple M-series uses 128-byte lines. Added how to query the line size, and 128-byte padding advice for false sharing.
- **Code bugs:**
  - The cache demo used a biased `sort(()=>Math.random()-0.5)` shuffle, an array that fits in L3, and the false comment "stride-16 has 16x more misses". Rewrote it with a Fisher-Yates shuffle, a 64 MB array, and ns-per-read output: random reads are about 13x slower than stride-16.
  - The working-set benchmark promised "200 GB/s"; a scalar JS loop can't show that. Replaced it with a pointer-chasing latency benchmark, measured locally (about 3 → 8 → 30 → 200+ ns).
- Fixed TLB details (two-level, overlapped with the L1 lookup), minor vs. major page faults, 16 KB pages on Apple, QPI→UPI, NUMA numbers, the "Go/Rust NUMA libs" claim, the LMDB/io_uring claim, and Optane → CXL.
- Added a multi-level AMAT formula plus memory-level parallelism vs. pointer chasing.
- **Added:** a cache coherence (MESI) section, plus a takeaway.

## phase1 / number-encoding
- **Code bug:** `nearEqual(1e15+0.1, 1e15+0.2)` was commented `false` but returns `true`. Replaced it with correct relative vs. absolute tolerance examples (1e16 spacing) and verified the output.
- Wrong: "signed overflow wraps in JavaScript". Fixed: `number` doesn't wrap; only the `|0` / `Math.imul` / Int32Array paths do. Rust wraps in release builds; Swift traps.
- Ariane 5 was a float→int16 conversion with an unhandled error, not a silent wrap. Boeing 787: 2³¹ ticks of 10 ms ≈ 248.5 days. Fixed the SNES/Genesis fixed-point claim to Doom and PS1.
- Fixed "for scientific work use decimal libraries" (wrong). Fixed `Number.EPSILON` wording (2⁻⁵²) and added IEEE 754-2019.
- Fixed the integer table: C `long` is 32-bit on Windows; switched to `int*_t` names. `long double` is platform-dependent. Added ML formats (bf16, FP8, FP4). Corrected the subnormal-performance and alignment claims.
- **Added:** the MSB = −2ⁿ⁻¹ view of two's complement, sign extension, C++20/C23 mandating two's complement, and a new **endianness** section with a DataView code example (verified). Plus takeaways.

## phase1 / character-encoding
- Fixed ASCII history: lowercase arrived in 1967. Updated to Unicode 17.0 (about 160k assigned characters). Added Plane 3 (TIP) and fixed the plane diagram. Thompson and Pike used a placemat, not a napkin. UTF-8 share is about 98%.
- **Added UTF-8 validity rules:** overlong forms (the IIS path-traversal exploit), no surrogates, nothing above U+10FFFF, `TextDecoder({fatal:true})`.
- Surrogates came with Unicode 2.0 (the UCS-2 history). Swift is UTF-8-native. **Added** lone surrogates and `isWellFormed()` / `toWellFormed()`.
- Mojibake table: fixed the cause of `ï¿½` (an already-replaced U+FFFD read as cp1252). Separated lossy `?` from font "tofu".
- MySQL: utf8mb3, strict-mode errors, the 8.0 default, and `utf8mb4_0900_ai_ci`. Removed the unsupported Django/Rails/WordPress claim.
- Fixed the Notepad history, the HTTP Latin-1 default, and HFS+ vs. APFS normalization.
- **Added** checklist items on locale case mapping (Turkish i, ß→SS) and validation.

## phase1 / program-execution
- **Outdated V8 pipeline:** it only listed Ignition → TurboFan. Rewrote it for 2026 as Ignition → **Sparkplug → Maglev → TurboFan** (with the Turboshaft backend). Updated the diagram, tips and takeaway.
- **Tail calls:** fixed "V8 doesn't implement TCO in general". Now: only Safari/JavaScriptCore implements proper tail calls (in strict mode); V8 and SpiderMonkey don't.
- Wrong memory-layout diagram ("kernel space at low addresses"). Redrawn: kernel at the top half, the mmap region, and the null page at the bottom.
- Fixed "BSS = initialized data". Fixed the escape-analysis claim: V8 uses scalar replacement, not stack allocation. Closure variables go into a V8 Context at parse time. The "arguments kills optimization" advice was Crankshaft-era; replaced it with the `delete` → dictionary-mode pattern, verified with `%HasFastProperties`.
- Corrected or updated:
  - lexing takes milliseconds per MB, not microseconds
  - the precedence explanation
  - `esprima` → acorn/SWC/Oxc
  - `BINARY_ADD` → `BINARY_OP`, plus CPython's specializing interpreter and experimental JIT
  - YJIT
  - consistent interpreter slowdown ranges
  - "10× slowdown reduces wall time" (wording inverted)
  - the LuaJIT computed-goto claim
  - the loader path (`_start` → `main`) and PGO
  - Wasm speed (about 1.1–2× native)
  - Benchmark.js (unmaintained) → tinybench/mitata
  - the "Modern blurring" paragraph (Leyden, NativeAOT, ART)
  - stack overflow mechanics (guard page, V8's own ~1 MB limit)

## phase2 / memory-stack-heap
- **Language-specific claim fixed:** "primitives are copied into a stack slot". Separated *value semantics* from *physical location*: V8 keeps strings, BigInts and HeapNumbers on the heap; Smis are immediate values. Added the C#/Swift struct point. Fixed the diagram labels and caption.
- Heap allocation: generational GCs use **bump-pointer allocation**, and the real cost is collection. malloc uses size classes.
- `structuredClone` throws on functions and drops class prototypes. Listed all the JSON-clone pitfalls (verified). `Object.freeze` covers all own properties and blocks extensions. Code-explanation line references were wrong; fixed.
- **Code bug:** `factorialIter(100000)` claimed "works" but returns `Infinity`. Switched to a BigInt version: 1000! has 2568 digits (verified).
- Rust: leaks are still possible (Rc cycles, `mem::forget`). The "GC pauses under 1 ms" claim was softened.
- **Added:** one stack per thread vs. a shared heap (data races), V8 closures sharing one Context (a leak gotcha), and register-passed arguments.

## phase2 / recursion
- **Big-O precision:** naive Fibonacci is **Θ(φⁿ)** (2·fib(n+1)−1 calls); O(2ⁿ) is a looser upper bound. Fixed the "fib(50) ≈ 10¹⁵ calls / a million seconds" claim: it is about 4×10¹⁰ calls, roughly minutes. Updated the code comment, quiz explanation and takeaway.
- **Code bug:** `fibMemo(100)` was commented as the exact value, but doubles print `354224848179262000000`. Added a note on rounding past fib(78) and a BigInt version (verified).
- Updated the V8 frame limit: about 10k frames for a trivial function, measured at 9,155 in Node 23. Removed the unsourced "2–5x slower" claim.
- Tail calls: only Safari/JavaScriptCore, strict mode only; V8 shipped and then removed them. Added Scheme, Scala, Kotlin and Clang `musttail`.
- Quicksort: O(n log n) is the average; recursion depth can be n, giving O(n²). Mentioned introsort.
- Fixed the history callout: LISP did have loops (PROG); added ALGOL 60 and lambda calculus. Fixed the tip "add memoization to avoid stack overflow" (memoization doesn't reduce depth).
- Corrected the "explicit stack is the worst of both worlds" paragraph: an explicit stack is the right tool for unbounded depth.
- **Added:** a note that `slice(1)` makes `sumList` O(n²); recursion depth equals tree height (balanced vs. degenerate trees); and a new code example converting recursion to an explicit stack, run against a 100k-deep chain (verified).

## phase2 / big-o-complexity
- **Added:** a section on bounds vs. cases (O/Ω/Θ are independent of worst/best/average; insertion sort as the example; a problem lower bound vs. an algorithm bound). Added formal Ω/Θ definitions, the three Master Theorem cases, and takeaways for both.
- **Amortised analysis:** added the accounting method, real growth factors (1.5× in V8/Java, 1.125× in CPython), and the fact that additive growth gives Θ(n) amortised. Added **amortised ≠ average case** (amortised is a worst-case guarantee over a sequence). Union-Find is O(α(n)).
- **Diagram bug:** the push diagram doubled at push 6. Fixed to resizes at sizes 2, 4 and 8.
- Fixed "balanced BST traversal is O(log n)" (it's lookup that is O(log n)). Fixed the string `+=` claim: ropes in V8, O(n²) in Java/C#/Go.
- Fixed the `>>> 1` explanation: the overflow concern applies to Java, not JS.
- Fixed "QuickSort O(1) space" (it needs O(log n) stack). Replaced the DoS anecdote with McIlroy's killer adversary and introsort. Updated library sort algorithms (TimSort, Powersort, introsort, pdqsort).
- Fixed the history: Landau popularised O and added little-o; Hardy–Littlewood introduced Ω in 1914; Knuth's 1976 article set today's definitions.
- Fixed the DP-on-NP-complete claim and the TSP heuristics-only claim.
- **Quiz:** q2's "O(8n²)" and q8's "all identical elements" were arguably also correct. Replaced both with clearly wrong distractors.

## Unsure / flagged
- Mermaid labels throughout the repo use a literal `\n` for line breaks. I kept that convention but didn't verify how the renderer handles it.
- Python 3.15 making UTF-8 mode the default (PEP 686) assumes 3.15 is released by now (Oct 2026).
- The benchmark numbers in the memory-hierarchy comments were measured on an M1 Pro under load from parallel agents, so they are labelled as approximate.
