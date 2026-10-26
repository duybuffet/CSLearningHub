# Content Review — system-design-distributed

Scope: phase8 `api-design-styles`, `microservice-patterns`, `observability-basics`, `system-design-case-studies`; phase14 (all 6).
Every JS example in these 10 files was extracted and run with `node`. The fixed versions run and print what their comments say; examples that only define functions were syntax-checked, and the saga example was run against stub services. Quiz answer positions are now spread across A–D in every file. The CRDT file already had its positions shuffled by someone else, so I left those alone.
Validation: `node scripts/validate-content.mjs api-design microservice observability-basics system-design-case phase14/` → **10 topics, 0 errors, 0 warnings**.

## phase8/api-design-styles
- Wrong → fixed: the text said PATCH is "idempotent when implemented correctly", but RFC 5789 makes no such guarantee. I fixed the text and the quiz q3 explanation.
- Wrong → fixed: "HTTP/2 multiplexing has no head-of-line blocking". TCP-level HOL blocking remains; HTTP/3/QUIC is what removes it.
- Wrong → fixed: "GraphQL always returns 200". That holds for field errors; the GraphQL-over-HTTP spec (`application/graphql-response+json`) returns 4xx for request errors. Fixed in the callout, the q7 explanation and the error section.
- Wrong → fixed: "DataLoader is never automatic in any framework". Query-compiling engines (Hasura, PostGraphile) avoid N+1 without it.
- Fixed: mutation serial-execution wording (applies to top-level fields), the muddled Protobuf "deletion looks like an add" line, and 422 now uses its RFC 9110 name. gRPC-Web now explains the trailers issue and mentions Connect.
- Added: Fielding's six REST constraints; idempotency is about server state, not the response; a new runnable **Idempotency-Key** code example (claims the key first, rejects a reused key with a different body (422) and an in-flight duplicate (409)); a takeaway; the q9 option now says caches don't store POST responses.

## phase8/microservice-patterns
- **Code bug (critical):** the saga's `store.save({status})` calls overwrote `chargeId`/`reservationId`, and `compensate()` saved `{status: COMPENSATING}` *before* loading the record, so no compensation ever ran. Now it merges and persists the whole state. Tested: release, then refund, then COMPENSATED.
- Code bug: the circuit breaker's HALF_OPEN let unlimited probes through (`halfOpenCount` was never used). It now limits trial calls (tested). The stateDiagram labels were quoted, which renders the quotes literally; quotes removed.
- Inconsistency fixed: choreography/orchestration step thresholds (the tip said 3+, the text said 4+).
- Fixed: Kafka as an event store (no per-aggregate optimistic concurrency), plaintext-VPC advice changed to mTLS/zero-trust, "K8s gives you a gateway for free" changed to Ingress/Gateway API controllers, 2PC described as blocking.
- **Added (gap):** a Dual-Write / **Transactional Outbox** section with diagram and runnable code (polling vs Debezium CDC, at-least-once, inbox dedup), saga isolation (ACD not ACID, semantic locks, pivot transaction), a takeaway, and quiz q7 replaced with an outbox question (the old one was a weak "which is FALSE").

## phase8/observability-basics
- **Math wrong:** "2% error rate = 14.4x burn, consuming 14.4% of budget per hour" and "0.2% = 1.44x". Correct for a 99.9% SLO: 14.4x means a 1.44% error ratio and 2% of the budget per hour; 6x means 0.6% over 6h (5%); 1x over 3 days (10%). Text, YAML and takeaway rewritten.
- **PromQL bug:** `rate(x{status=~"5.."}) / rate(x)` matches label-for-label, so each 5xx series is divided by itself (ratio 1). Now uses `sum by (job)` recording rules, in the RED text too. Removed an invalid `div` template function. Explained the actual job of the short window (fast reset), which also fixes the q10 explanation.
- **Code bug:** the old example used the whole `traceparent` header as the trace id and propagated `x-trace-id`. Rewritten as a runnable W3C traceparent parse/format with correct child span ids.
- Outdated → fixed: OTel semantic conventions (`http.request.method`, `http.response.status_code`, `db.query.text`, …); profiles as an emerging 4th signal; Prometheus 3 OTLP ingestion and native histograms; the tip now starts with OTel (the 2026 default). The metric-type diagram had Histogram as a child of Gauge; rebuilt. Removed the "PostgreSQL has scheduled maintenance windows" claim; "SLA always weaker" changed to "typically looser".

## phase8/system-design-case-studies
- **Arithmetic wrong:** "62^6 = 56B covers decades". At 36.5B links/year it lasts about 18 months; 62^7 (3.5T) lasts about 96 years. Changed to 7 characters (code, text, takeaway).
- **Arithmetic wrong:** presence "50M DAU × 12/min = 10M/min = 166k/s". It's 600M/min = 10M/s. Rewritten with concurrency (10M online), a 30s heartbeat (333k/s), and `SET … EX` instead of HSET without TTL.
- Wrong: "116k reads/s on a single Postgres is feasible (10k–50k qps)" contradicts its own numbers; fixed. Polling: DAU is not concurrency. "9.5 TB/yr fits a single Postgres cluster" now gets a sharding caveat. The feed sorted set had post IDs "as scores"; now members, with timestamps as scores.
- Code bugs: the feed merge never sorted by time (celebrity posts landed in the wrong place). It now uses WITHSCORES, a single celebrity query, a merge-sort and keyset fan-out. The URL cache TTL is capped at expiry. Removed the dubious claim "bit.ly uses Cassandra" in favour of the Discord Cassandra→ScyllaDB story. Cassandra key now includes a time bucket and a Snowflake id. "Kafka topic per group" changed to partition by conversation.
- **Added:** a back-of-envelope cheat-sheet callout (86,400 s ≈ 10^5, peak 2–3×, DAU vs concurrent, ID spaces, node throughputs, latencies) and a takeaway. Quiz explanations now mention allkeys-lfu and `ZRANGE … REV`.

## phase14/distributed-systems-fundamentals
- **The intro promised PACELC but the topic never covered it.** Added a section on PACELC, synchronous/asynchronous/partially synchronous models, **FLP** (safety always, liveness via partial synchrony) and Two Generals, plus a takeaway and a tip line.
- Wrong: "S3 eventually consistent" (strongly consistent since Dec 2020); "DynamoDB uses leaderless quorums" (it uses Multi-Paxos leaders); "single-leader PG with sync replication is linearizable" (replica reads aren't); "DynamoDB session strongly-consistent reads" give RYW.
- Wrong: "idempotency keys must be deterministic, not random". The real rule is one stable key per logical operation (Stripe recommends a random UUID). Fixed in the text, the tip, the takeaway and q10.
- Code bugs: in the client, the "no-retry 4xx" error was thrown inside the `try` and caught, so it retried anyway, and 5xx looped with no backoff. The server had a check-then-act race. The quorum demo awaited in array order, not arrival order. `withRetry` retried CIRCUIT_OPEN errors, and fetch didn't fail on 5xx. All rewritten and run. Jitter "±30%" didn't match the code; it now describes full jitter. "Phantom reads" renamed "stale reads". Fallacies attribution (Deutsch 7 + Gosling 1) and hedging citation (Tail at Scale) fixed.

## phase14/consistency-models
- **Quiz bug:** q9 marked "17" as correct; the right answer is 12.
- Wrong: PACELC credited to "Patterson" (it's Abadi), in the text and q8. Wrong: "x86 TSO is stronger than SC" (it's weaker). Language memory models are now described as SC-DRF.
- Wrong: "snapshot isolation is serializable" (write skew) and "etcd has no multi-key transactions" (it has Txn). The serializable-vs-linearizable examples and q7 explanation are rewritten. Strict serializability: "PostgreSQL + sync replication" replaced with Spanner/FoundationDB.
- Wrong: S3 "strong consistency optional"; Cosmos DB "causal level" (it's the Session level); "Riak pre-2.0 siblings"; "Dynamo shopping cart was an OR-Set"; "Notion/Linear migrated to CRDTs" (unverified, removed).
- Code: `dynamoDB.get` results now read `.Item`; nonsensical Option D (ConsumedCapacity as a version) replaced with a real version-token fallback pattern. The quorum ≠ linearizability trap is now stated correctly (sloppy quorums, LWW, ABD write-back).

## phase14/consensus-raft-paxos
- **Code bug:** the Paxos demo crashed (`prepare(2001)` is not greater than 2001, so Phase 1 failed). Rewritten so p1's value is chosen on a majority and p2 must adopt it. Runs: "Final: A".
- **Raft code rewritten:** it now has both RPC receivers (election restriction, log-matching check, conflict truncation), the **current-term commit rule**, and a no-op on election. The demo shows an uncommitted entry being overwritten and every node's commitIndex reaching 2. The old heartbeat sent `prevLogTerm: 0`, which followers would reject.
- Figure 8 is now explained concretely (S1/S5 scenario), plus why the no-op exists. Step 5 of log replication now says "current-term entry". Log Matching Property stated precisely.
- Wrong history: Paxos was published by TOCS itself in 1998, not "a different journal"; "Paxos Made Simple" was 2001, not 2007, and it isn't two pages; the user study described accurately. ZAB/VR are not "Paxos implementations". Uncommitted entries on a majority *can* survive a leader crash, so retries can double-apply, which needs client sessions.
- **Added:** FLP takeaway, a "What production Raft adds" section (PreVote, ReadIndex/leases, snapshots, batching, Multi-Raft), membership changes (single-server changes, learners), Kafka KRaft. Quiz q1 replaced with a commit-rule question; q9 reworded (it asked for a "liveness property" but the answer was a safety property).

## phase14/replication-and-partitioning
- Wrong: "Cassandra LOCAL_QUORUM/EACH_QUORUM control sloppy quorums". Those levels are about datacenter scope, and Cassandra doesn't use sloppy quorums (only `ANY`). "DynamoDB anti-entropy/leaderless" and "Dynamo paper powering DynamoDB" fixed. Redis Cluster uses 16,384 hash slots, not a vnode ring.
- **Quiz q4 wrong premise:** Cassandra hashes partition keys, so the hotspot comes from every write sharing one key value, not from range partitioning. Rewritten. q5 explanation math clarified.
- Code bug: the quorum simulator returned the *first* defined value (not the highest version) and always read the nodes it had written. Rewritten to read the least-overlapping set, with a W=R=1 stale-read contrast.
- Fixed: transatlantic latency (~70–150 ms), the vnode counts (Cassandra 256 tokens historically, 16 since 4.0), the diagram saying 1000 partitions where the numbers add up to 300, RF=3 two-failure semantics, Kafka ISR/KRaft wording, fencing for failover, the hinted-handoff diagram.

## phase14/logical-clocks-and-ordering
- Wrong: "DynamoDB uses version vectors" (the Dynamo paper did, DynamoDB doesn't); "Git uses vector clocks" (Git uses a commit DAG); "distributed tracing uses Lamport clocks"; "Cassandra LWT uses causal delivery" (it uses Paxos). All fixed.
- The vector-clock diagram had the a2 edge coming from a1; it now comes from the send event. Plausible clocks had false positives and negatives reversed (they can miss conflicts, not invent them).
- Misconception 4's example was wrong (with read context, version vectors *do* flag that case). Rewritten around blind writes and multi-key write skew. HLC receive rules made explicit if/else-if. CockroachDB clock-skew behaviour corrected (uncertainty restarts; a node self-terminates at 80% of max offset).

## phase14/crdts-eventual-consistency
- Wrong: "Google Docs/Notion/Figma use CRDTs" (Docs uses OT; Figma is CRDT-inspired); "ShareDB uses RGA" (ShareDB is OT); "RGA uses timestamp vectors" (it uses Lamport id + replica); "Yjs powers Monaco/VS Code web"; Phoenix LiveView CRDTs; "Yjs followed Automerge" (Yjs came first, ~2015); "HLL is not a strict CRDT" (its max-merge is a semilattice); "Automerge does tombstone GC" (in q8).
- **Gap:** state-based correctness needs *inflationary updates* plus the join-semilattice. Added to the text and takeaway. Op-based CRDTs need **exactly-once** plus causal delivery; quiz q6 had "exactly-once" as a distractor, which was itself defensible, so I replaced that option.
- The analogy's "move" as remove-old/add-new in an add-wins set would put the note in two places; rewritten as an LWW/MV register. Clarified that the OR-Set concurrent add/remove scenario requires an observed add. Mentioned ORSWOT and the Riak/Basho status.

## Unsure / worth a second look
- Discord's Cassandra→ScyllaDB migration is dated "2022–2023" (the blog post is 2023; the migration was finishing in 2022).
- I described OTel profiles as "being added as a fourth signal" because I'm not sure of its exact maturity status in late 2026.
- I wrote that Figma's multiplayer is "CRDT-inspired", based on Figma's own blog.
- Prometheus native histograms and OTLP ingestion in 3.x: correct to my knowledge; I didn't pin exact versions.
- Statements I wrote but couldn't run: the alert-rule YAML (no YAML parser or promtool available here; I checked its structure by eye) and the DynamoDB `update`/`ADD version` code (syntax only).
