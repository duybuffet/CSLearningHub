# Content review — os-net-concurrency

Files: phase5/{processes-threads, virtual-memory, concurrency-deadlocks}, phase6/{osi-tcp-ip, ip-routing, tcp-udp, http-dns}, phase15/{concurrency-vs-parallelism, async-and-event-loop, actor-and-message-passing, lock-free-and-atomics}.
Checks: every JS block run with Node 23, the Python block with python3, the C++ block compiled with clang++, every Mermaid diagram parsed with the repo's mermaid package (58/58 OK). Quiz answer positions spread across A–D in all 11 files.

## phase5/processes-threads
- Wrong → fixed: CFS was described as the current Linux scheduler. Now: CFS 2007–2023, **EEVDF since 6.6**, matching the new cpu-scheduling topic (section text, key takeaway, q5). Scheduling section kept short and points to the CPU Scheduling topic. (Lead's consistency request: done.)
- Wrong → fixed: "thread switches 5–10× faster"; "steps 3 and 4 skipped" (there were only 3 steps); PCID "tags with the process ID" (it's a 12-bit kernel-assigned ID); "fork/exec flushes CPU caches"; state diagram `New : fork() or exec()` (exec doesn't create a process); Plan 9 said to use CreateProcess (wrong); SQLite "uses mmap extensively" (it's optional; LMDB is the real example); signals "no payload" (real-time signals carry one); "Node adds a microtask queue"; `os.cpus()` called physical cores.
- Code bug: event-loop example's predicted order was wrong (chained `.then` runs after `queueMicrotask`). Fixed code, comments and explanation (checked with Node).
- Added: context-switch cost numbers (1–5 µs direct, plus cache/TLB warm-up, vs ns for coroutines); new section "Linux reality: tasks, clone(), zombies and orphans" (PID 1 / `tini`); note on free-threaded CPython 3.13/3.14; posix_spawn/vfork.

## phase5/virtual-memory
- Code bugs: printed `heapTotal` labelled "Virtual size" (removed); BigInt address split comments were wrong (real output 255/509/253/497/564).
- Wrong → fixed: TLB "flushed on every context switch" (PCID/ASID); TLB size 32–1024 (now L1 ~64–96, L2 ~1.5–3K); "a TLB miss means 2 RAM accesses" (it's up to 4 extra with 4 levels); major fault 1–10 ms (now NVMe tens of µs to HDD ms); KPTI "TLB flush every syscall" (PCID avoids it; newer CPUs don't need KPTI); VMAs in rb-tree (maple tree since 6.1); text at 0x400000 (PIE + ASLR); OS/360 "introduced segmentation" and the VAX history (rewritten: Atlas, B5000, Multics, S/370, 80386); takeaway saying huge pages cure thrashing.
- Added: 5-level paging (LA57, 57-bit VA, P4D, user space opt-in above 47 bits); Intel vs Linux level names; ASLR; THP and fork COW (why Redis disables THP); warning callout on overcommit and the OOM killer (exit 137 / OOMKilled).

## phase5/concurrency-deadlocks
- Wrong → fixed: Coffman "if and only if" (they are necessary; enough only for single-instance resources); "a cycle means deadlock" (same caveat; added the wait-for graph); **2PL presented as preventing hold-and-wait** (strict 2PL can deadlock; only conservative 2PL can't); invented PostgreSQL "TID order" claim removed; DB detectors now correct (InnoDB checks right away and rolls back the transaction that changed fewest rows; PG waits `deadlock_timeout` and aborts the transaction that ran the check); ARM CAS = "STREX" (LDXR/STXR or LSE CAS); Banker's cost O(m·n²); ABA description; "two properties" listing three; mutex ops called wait/signal.
- Code bugs: the async mutex chain broke for good after one rejection; top-level `await` in a script; wrong "800 or 700" claim (it is always 700); the semaphore was never used; `transferWithTimeout` **unlocked twice** and its "exponential" backoff was linear; `transferSafe` had two identical if/else branches. All rewritten and run.
- Added: section on condition variables and monitors (Mesa semantics, spurious wakeups, `while` not `if`), plus a working Python bounded-buffer example; futex fast path; lockdep; q4 rewritten (the old "sufficient" wording was wrong).

## phase6/osi-tcp-ip
- Wrong → fixed: IPv6 "trillions per atom on Earth" (now ≈4×10²⁸ per person); DB ports listed as well-known ports; ephemeral range "49152–65535 on Linux" (it's 32768–60999); "a socket is the 4-tuple" (a connection is); teardown diagram showed FIN / FIN-ACK (now four segments); TIME_WAIT (60 s on Linux, client-side port exhaustion vs server `SO_REUSEADDR`); MSS "negotiation" / PMTUD (and the ICMP-blocking bug); BGP table size (~1M); HTTP/3 share; "live streaming uses UDP" (WebRTC does; YouTube/Netflix use HTTP); debugging tip now separates "refused" from "dropped".
- Code bugs: overhead calculator had wrong numbers in its explanation (67 bytes / 98.5%) and treated 8 KB as one frame. Rewritten per-MSS with TLS 1.3 record overhead. The TCP demo never exited (client never read data). Fixed.
- Added: ARP/ND pointer, note that BGP runs over TCP.

## phase6/ip-routing
- Code bug: `console.table` printed an empty table (`parseInt('/8')` gives NaN).
- Wrong → fixed: IPv6 per-person figure (4.8×10¹⁹ → ~4×10²⁸); EIGRP called a "dominant" IGP (now IS-IS); OSPF cost example (1G = 100M = 1, raise the reference bandwidth); RIP hop wording; BGP decision list was missing Origin (Cisco weight noted); the 2019 Verizon event was a route leak, not a hijack; RIB vs FIB; TCAM / pps claims; admin distances marked as Cisco values; K8s dual-stack GA in 1.23; RPKI status in 2025; q4 explanation contradicted itself; intro diagram mixed up the host's decision with the router's (and NAT location).
- Added: section "Default gateway and ARP" (how a host makes the on-link decision, ARP spoofing, wrong-mask symptoms); IPv6 /64, SLAAC, /48 and /56 allocations; Happy Eyeballs.

## phase6/tcp-udp
- Wrong → fixed: CUBIC loss response "halved" (it's β=0.7) and CUBIC still the default on Linux, Windows and macOS; BBR status (v3, not the Linux default, fairness issues); ECN "all routers must support it"; TIME_WAIT 60–120 s and "uses an fd"; handshake RTT claims (TCP+TLS1.2 = 3 RTT, TCP+TLS1.3 = 2, QUIC = 1); QUIC connection IDs "chosen by the server"; UDP "1.5 RTT"; UDP checksum "less comprehensive"; DNS ">512 bytes → TCP" (EDNS 1232 / TC bit); gRPC-over-HTTP/3 claim; RTO details; seq-number example ignored the ISN.
- Added: **TCP state-machine diagram** (SYN_SENT … FIN_WAIT_1/2, TIME_WAIT, CLOSE_WAIT, LAST_ACK), the accept queue / somaxconn, SYN cookies on Linux, CLOSE_WAIT = app bug, Nagle + delayed-ACK and `TCP_NODELAY`, RACK-TLP, L4S, QUIC header encryption and ossification, HTTP/3 discovery and fallback (2026 status). The quiz had 9 of 10 answers in position B; now spread.

## phase6/http-dns
- Code bugs: `httpClient` was `async`, so `api.get` was undefined; it **retried POST on 5xx** (could duplicate side effects); `Retry-After` dates became NaN. Rewritten with timeouts, retries only for idempotent methods or requests with an idempotency key, 408/429 handling, and jitter. Tested against a local server. WebSocket client: it skipped reconnecting on 1001 (wrong — 1001 usually means a deploy); added jitter.
- Wrong → fixed: Happy Eyeballs attributed to resolvers; 13 roots as "clusters of hundreds" (now 13 identities, ~2,000 anycast instances; resolvers usually skip the root); HTTP/2 "no head-of-line blocking"; CORS preflight triggers (JSON Content-Type), the `*` + credentials explanation, and "server may have processed it"; DELETE idempotency wording; "4xx never retry" (408/429); 422 renamed; Comodo → Sectigo; TLS 1.3 flight (CertificateVerify); forward secrecy "vs TLS 1.0/1.1"; sticky sessions for WebSockets.
- Added: section comparing HTTP/1.1, HTTP/2 and HTTP/3 (with a table); section on DNS caching layers, negative caching, EDNS/TCP fallback, DoH/DoT vs DNSSEC, and Node `dns.lookup` vs `resolve`; HTTPS/SVCB, CAA and PTR records; SNI/ECH; post-quantum X25519MLKEM768; certificate lifetimes 200→100→47 days (CA/B SC-081).

## phase15/concurrency-vs-parallelism
- Code: Gustafson output comments were wrong (57.30 → 57.70; 16- and 32-core lines missing); `os.cpus()` → `os.availableParallelism()`.
- Wrong → fixed: **`fs.readFile` uses epoll** (it uses the libuv thread pool); microtasks "after each phase" (after each callback since Node 11); the GIL paragraph said "I/O-bound" where it meant CPU-bound; "10k threads × 4 MB = 40 GB RAM" (that's virtual memory; the real costs are elsewhere); coroutines with "KB stacks" (they are stackless state machines); SMT description; Amdahl 3.8→4 example; Haskell STM year (2005).
- Added: data race vs race condition; free-threaded CPython.

## phase15/async-and-event-loop
- Wrong → fixed: Node microtasks "after each phase transition" (after every callback since v11); poll-phase blocking rule; "parallel" used for Promise.all (it's concurrent); "every await lets macrotasks run"; history of who specifies the microtask queue; yielding advice (`setImmediate`, `scheduler.yield`, 4 ms clamp).
- Verified: both ordering examples match Node output. Added the CJS vs ESM nextTick/promise flip (verified) and a note that the top-level lines print first.
- Added: section on cancellation and timeouts (AbortController, `AbortSignal.timeout`, `AbortSignal.any`) with a runnable example.

## phase15/actor-and-message-passing
- Wrong → fixed: "canonical Actor Model guarantees per-pair order" (Hewitt's model guarantees no order; Erlang and Akka add per-pair order); BEAM "doesn't rely on OS threads" (it runs one scheduler thread per core); WhatsApp numbers (~32 engineers / 450M users in 2014; ~50 / 900M in 2015); "five nines" vs "nine nines" inconsistency (AXD301 claim marked as reported); "no deadlocks" overclaim; restart intensity (OTP default 1 in 5 s); "supervisor policy file"; history (CSP is a separate tradition, Hoare 1978, Go's actual ancestor; π-calculus 1992; Agha 1985; Erlang developed independently); Akka licence and Apache Pekko; Orleans/Halo.
- Code: the "restart" created a worker that was never wired up and was dead code. Rewritten as a working one-for-one supervisor with a stable ref and a restart limit; output verified.
- Added: Actors vs CSP (Go channels) comparison table.

## phase15/lock-free-and-atomics
- Wrong → fixed: **ABA example was wrong** (the push-based scenario doesn't corrupt anything). Rewritten as the classic pop ABA, text and diagram. Also fixed: x86 `LOCK` "locks the bus" (it locks the cache line); aligned atomicity "due to bus locking"; progress hierarchy "⊂ blocking"; LL/SC "solves ABA" (not usable from portable code); RCU "epoch-based, publishes via CAS" (release store, writers take a lock); MVCC conflict detection; **Herlihy did not win a Turing Award** (removed; Dijkstra Prize 2003); "lock-free coined in 2008"; "a process dying holding a lock = deadlock"; mutex/atomic cost numbers; `Atomics.wait` main-thread rule (browser vs Node).
- Code: CAS-loop comment claimed "the spec requires a fresh load" (false; it now uses the returned value). The version-stamp demo did two separate non-atomic steps. Rewritten as a real single 64-bit `BigInt64Array` CAS that shows the ABA being caught. Removed the bogus `--experimental-vm-modules` flag.
- Added: acquire/release pairing (synchronizes-with), `acq_rel`, store-buffer reordering on x86, compiler hoisting; a compiled C++ release/acquire example (language `text`, since C++ isn't highlighted); **SharedArrayBuffer cross-origin isolation (COOP/COEP)**; ARM LSE; GC as an ABA mitigation; q6 replaced (trivia → acquire/release understanding).

## Unsure / worth a second look
- Market-share numbers (HTTP/3 "a fifth to a third", IPv6 "close to half", RPKI "about half", ~2,000 root instances) are approximate and hedged on purpose.
- Post-quantum TLS: I named only Chrome, Firefox and the CDNs (not sure about Apple's default status). `Atomics.waitAsync` browser coverage isn't spelled out.
- C++ snippet uses language `text` (no C++ highlighting in the renderer).
