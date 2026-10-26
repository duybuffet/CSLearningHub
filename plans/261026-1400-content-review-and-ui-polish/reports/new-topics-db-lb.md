# New topics: SQL Queries & Joins, Normalization & Data Modeling, Load Balancing

Validator: `node scripts/validate-content.mjs sql-queries normalization load-balancing` gives 3 topics, 0 errors, 0 warnings.
I also parsed every Mermaid diagram with the repo's `mermaid` package (12/12 parse, and a deliberately broken control diagram fails).

## How things were verified
- **SQL**: every SQL `code_example`, and the prose snippets that show results, were run on a local PostgreSQL 14 in a throwaway database (since dropped). The result tables in prose and comments are copied from real output. The EXPLAIN plan (hash join) is real output from 1M×100k generated rows, with costs and widths trimmed. Merge Join and Nested Loop plans were also observed on the same data.
- **JS**: every JS example was extracted from the final JSON and run with node 23. Output comments match exactly, and the seeded PRNGs make the simulation output deterministic.
- Nothing in curriculum.json or in the sibling topics was edited.

## phase7/sql-queries-and-joins.json (23 sections, 4 diagrams, 3 code)
- Running dataset: customers (incl. Chen with no orders and a NULL city) and orders (incl. guest order 104 with a NULL customer). It covers every join edge case.
- Covers: relational model, SELECT/WHERE/ORDER BY/LIMIT, the logical processing order (diagram), deterministic LIMIT, keyset vs OFFSET pagination, NULL and three-valued logic (truth table, `<>` dropping NULLs, the NOT IN trap, aggregate NULL rules, NULLS NOT DISTINCT in PG15), INNER/LEFT/RIGHT/FULL/CROSS/self joins with result tables, ON vs WHERE on outer joins, anti-join, GROUP BY/HAVING/FILTER/ROLLUP, the fan-out trap, IN vs EXISTS vs JOIN (semi/anti-join plans), LATERAL top-N, CTEs (PG12+ inlining, MATERIALIZED), recursive CTEs (diagram, CYCLE/SEARCH in PG14), window functions (row_number/rank/dense_rank tie table, default RANGE frame peer gotcha, LAG), ON CONFLICT upsert (EXCLUDED, DO NOTHING, "cannot affect row a second time", MERGE PG15/RETURNING PG17), EXPLAIN reading plus the nested loop/hash/merge algorithms (diagram), N+1 and SQL injection (JS demo, allowlists for identifiers).
- It does not repeat acid-indexes' EXPLAIN node glossary. It focuses on the plan tree, estimates vs actuals, loops, Batches, and join algorithms.
- Quiz answers: A A B C C A B D C B.

## phase7/normalization-and-data-modeling.json (23 sections, 4 diagrams, 3 code)
- One running example (a university enrollment sheet) goes UNF → 1NF → 2NF → 3NF → BCNF, with tables at each step, a decomposition flowchart, and a classDiagram ER (no erDiagram).
- The BCNF case is real: there are overlapping candidate keys {student, course} and {student, instructor}, with instructor → course. The chapter explains lossless vs dependency-preserving decomposition, and resolves the lost dependency in the final DDL with a composite foreign key. Both rejections were tested.
- JS example: an attribute-closure and BCNF-violation checker for the example's FDs (run, output matches).
- Also covers: ER cardinality and optionality, M:N junction tables, keys (superkey, candidate, alternate, natural vs surrogate, identity vs UUIDv4 vs UUIDv7, `uuidv7()` built into PG18), FDs and Armstrong's axioms, anomalies, deliberate denormalization rules, a brief star schema (points to the OLTP vs OLAP chapter), soft deletes (partial unique index, views, GDPR erasure), JSONB vs columns (GIN jsonb_path_ops vs jsonb_ops), expand/contract migrations with PG lock specifics (diagram), and document embed vs reference.
- Quiz answers: B D B A C D B A C D.

## phase8/load-balancing.json (24 sections, 4 diagrams, 3 code)
- JS simulation (seeded): RR / weighted RR / random / least-conn / P2C against one half-speed backend at 85% load. RR and random make the slow node unstable (mean of about 680 ms and climbing), while least-conn and P2C stay at about 4 ms.
- JS graceful drain: fail readiness, wait for the LB, `server.close()`, `closeIdleConnections()`, hard deadline (runs end-to-end with a real HTTP server).
- JS retry demo: herd peak without vs with full jitter (1000 vs 162 per 10 ms), and a 10% retry budget.
- Also covers: L4 vs L7 (table, gRPC/HTTP/2 pinning), algorithms incl. Maglev and bounded-load consistent hashing (links to the Consistent Hashing chapter), active/passive health checks, readiness vs liveness, fail-open/panic threshold, session affinity, TLS termination/re-encryption/passthrough, XFF/Forwarded/PROXY protocol trust, draining, GeoDNS/anycast, NGINX/HAProxy/Envoy (NGINX snippet), ALB/NLB/GWLB/GCP/Azure, K8s Gateway API, client-side LB and meshes (Istio ambient), VRRP/ECMP, and retries/thundering herd/slow start/hedging.
- Quiz answers: B C A D B C A B D C.

## Things I was less sure about (worth a second look)
- **ingress-nginx retirement**: the text says the community controller was retired, with best-effort maintenance ending in March 2026, and recommends Gateway API implementations. This is based on the Kubernetes announcement of November 2025. Remove it if the lead prefers not to date-stamp it.
- **Istio ambient GA in 1.24 (late 2024)** and **PG18 `uuidv7()`**: I'm confident about both, but they are version-specific claims.
- **AWS defaults** quoted: ALB health check 30 s interval / 5 healthy / 2 unhealthy, deregistration delay 300 s, cross-zone on by default for ALB and off by default for NLB. These are correct as I know them, but AWS changes defaults from time to time.
- The EXPLAIN output is from PG14 (the only local server). The plan shapes and fields are the same in PG16–18.
- Section counts are 23/23/24. LB is one over the ~23 target because TLS, draining and SPOF each needed their own section.
