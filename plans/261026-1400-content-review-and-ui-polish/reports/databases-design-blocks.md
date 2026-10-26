# Content review — databases-design-blocks

Scope: phase7 acid-indexes, sql-nosql-cap, transaction-isolation-levels, database-storage-internals, oltp-vs-olap, caching-and-search-stores; phase8 architecture-patterns, scalability, caching-and-cdn, message-queues-and-streaming, rate-limiting, consistent-hashing.

How it was checked: I tested SQL against a throwaway PostgreSQL 14 instance (anything that needs PostgreSQL 18 was checked by reasoning only). JS examples were run under Node 23 with a local Redis 7 and ioredis, using stubs for DB, fetch and JWT. Kafka and Elasticsearch code was checked against the docs. Every file got quiz answer positions spread across A–D. Validation: `node scripts/validate-content.mjs … ` → 12 topics, 0 errors, 0 warnings.

## phase7/acid-indexes
- Normalization was a full section, a diagram, a code block, a quiz question and a takeaway → cut down to a short "A Note on Schema Design" that points to the new chapter. The NF code is now a write-skew / SERIALIZABLE example.
- Wrong: "MySQL DDL is transactional" → it's an implicit commit; MySQL 8 atomic DDL only covers single statements. PostgreSQL DDL is transactional, except `CREATE INDEX CONCURRENTLY`.
- Wrong: undo-log rollback was presented as universal → PostgreSQL has no undo log, so rollback is near-instant; InnoDB and Oracle use undo logs.
- Isolation list: added the defaults (PG/Oracle/SQL Server RC, MySQL RR), PG RR = snapshot isolation (allows write skew), the InnoDB RR hybrid, SSI with 40001 retries, lost update, and write skew. Diagram and caption fixed.
- WAL: `fsync=off` can corrupt the database, not just lose seconds → recommend `synchronous_commit=off` (loses up to 3×wal_writer_delay). Added group commit, fixed recovery wording (ARIES undo vs PG), honest storage caches.
- `FOR UPDATE` comment wrongly said "Repeatable Read semantics / phantom" → it prevents lost updates.
- B+tree diagram was inconsistent (k keys with k children; key 95 sat past separator 90) → redrawn. Added the InnoDB clustered index.
- Composite index advice: "most selective first" was presented as the main rule → equality-then-range; noted PG 18 skip scan.
- Hash-index wording fixed. New q5 (write skew).

## phase7/sql-nosql-cap
- CAP Availability was defined as "response — success or failure" → a non-error response from a non-failing node. Added that CAP-C (linearizability) ≠ ACID-C.
- Wrong: "Cassandra and Redis Cluster use hash mod N" → token ring and 16,384 hash slots. Added the mod-N remap problem; the JS demo prints 80% of keys moving on 4→5.
- Wrong: "DynamoDB lets app code reconcile" (that was the Dynamo paper; DynamoDB global tables use LWW). "Redis Cluster uses CRDTs" → Redis Enterprise Active-Active.
- PACELC: dated it (2010/2012), corrected the classifications (Cassandra/DynamoDB PA/EL, Spanner/etcd PC/EC, MongoDB PA/EC), and removed "single-node PG is PC/EC".
- Quorums are not automatically linearizable (sloppy quorum, LWW). Sync replication ≠ visible (`remote_apply`).
- Added distributed SQL / NewSQL (Spanner, CockroachDB, YugabyteDB, TiDB, Aurora DSQL) and MongoDB multi-document transactions.
- Code: claimed shard output was wrong → replaced with the real output. `cap` labels fixed: Neo4j "CA" → CP (Raft); Redis cluster is not CP.
- Quiz q3 had two correct answers (R=1/W=3 also totals 4) → distractor changed. Sequence-diagram quotes removed.

## phase7/transaction-isolation-levels
- New section and SQL example: lost update and read skew (Berenson et al. 1995) with 4 fixes. MySQL RR does NOT detect lost updates; PG RR aborts with 40001.
- RR snapshot is taken at the first statement, not at BEGIN. PG RR also needs retry logic.
- Write-skew definition was wrong ("writes don't touch the other's read set") → write sets don't overlap; rw-dependencies are what SSI tracks. Added fixes: FOR UPDATE, UNIQUE/EXCLUDE constraints, materializing conflicts.
- SSI: dangerous-structure detection, false positives, lock promotion, READ ONLY DEFERRABLE; fixed the dating (9.1 in 2011, paper 2012). Wrong error message in the write-skew example fixed.
- MVCC visibility rule rewritten correctly (snapshot xmin/xmax/xip).
- SQL bugs: `pg_stat_user_tables.tablename` → `relname`; txid_* → `pg_current_xact_id()` / `pg_current_snapshot()`; impossible snapshot example fixed; added a pg_stat_activity query.
- Removed "MyISAM used Read Uncommitted". Added SQL Server RCSI defaults (on in Azure SQL). Dependency-cycle diagram redrawn; sequence-diagram quotes removed.

## phase7/database-storage-internals
- WAL rule was stated wrongly ("log before modifying the buffer") → a page may not be flushed before its WAL. PG has no undo phase.
- New section: torn pages (full_page_writes, InnoDB doublewrite).
- B+tree math was wrong (said 500³ for height 3) → ~250k leaves × ~400 keys ≈ 100M (q9 fixed too). Diagram redrawn.
- Size-tiered was not "early LevelDB" (LevelDB is leveled) → added TWCS, UCS (Cassandra 5) and FIFO. Amplification numbers revised.
- shared_buffers >40% rarely helps (double buffering); InnoDB uses 50–75% (O_DIRECT). PG has a heap plus B+tree indexes. PG never merges index pages.
- MVCC location differs: PG heap vs InnoDB/Oracle undo. PG 18 checksums on by default.
- "RocksDB is Kafka storage" → Kafka Streams state stores; added Pebble. B-tree date 1970/1972.
- Added the tombstone / gc_grace trap. MVCC diagram fixed (it labelled dead tuples as "visible").

## phase7/oltp-vs-olap
- Snowflake example clustered on columns the fact table doesn't have, and pruning was filtered through a dimension → filter on `f.date_id`; added valid PG declarative partitioning (verified pruning with EXPLAIN).
- Facts fixed: micro-partitions are 50–500 MB uncompressed; Time Travel defaults to 1 day (90 on Enterprise); cloning ≠ sharing; BigQuery flat-rate was replaced by Editions; result cache ~24 h; PG MV refresh is full.
- Wrong: "SELECT holds locks" (MVCC) → I/O, cache eviction, VACUUM horizon (q8 fixed). Codd coined OLAP only, not OLTP.
- Added zone maps, vectorized execution, CDC/Debezium, ClickHouse, hot-standby conflicts / hot_standby_feedback, and PG columnar extensions.
- dbt BigQuery int partition needs `range`; the incremental snippet was the wrong grain. Diagram said "4 rows" but showed 3.

## phase7/caching-and-search-stores
- Added Redis persistence (RDB/AOF everysec, async replication, WAIT) and threading (single-threaded execution, I/O threads since 6.0).
- New licensing callout: Redis 7.4 RSAL/SSPL (2024), Valkey fork, Redis 8 AGPLv3, Elasticsearch SSPL (2021) → OpenSearch (LF foundation 2024), Elastic AGPL (2024).
- Redis code: lock had no owner token → token plus Lua compare-and-delete; INCR+EXPIRE and HSET+EXPIRE made atomic via MULTI; ZINCRBY; ZRANGE REV; negative caching (all run).
- Elasticsearch: the v9 client removed `body`; index-time `boost` is deprecated; the stop filter was placed after the stemmer; ES 7+ defaults to 1 primary shard; added the translog; `refresh=wait_for`.
- PER was misattributed to Facebook (they use leases; XFetch is Vattani et al.). Twemproxy is not read-through. volatile-lru degradation condition fixed. ziplist → listpack, quicklist.
- New: PostgreSQL full-text search section and SQL (tsvector + GIN + pg_trgm, run), vector/hybrid search, the slow-reader invalidation race, fencing tokens.

## phase8/architecture-patterns
- Gateway code: the rate limiter never reset, `/auth/login` required a token, the query string was dropped, prefix match was sloppy, there was no timeout, and it crashed on non-JSON → rewritten and tested.
- Circuit breaker counted no 5xx (fetch doesn't throw) and let unlimited half-open probes through → rewritten and tested.
- Queue example had the dual-write bug → transactional outbox; dedupe on event ID; email idempotency key; nack to DLX instead of a requeue hot loop.
- Kafka topic semantics are per consumer group. Istio Pilot → istiod plus ambient mode. Linkerd uses its own proxy.
- Netflix callout had invented CQRS details → rewritten with verifiable history (Hystrix in maintenance 2018, Envoy mesh). The Shopify "more than Amazon" claim was removed.
- Added modular vs distributed monolith, Prime Video 2023, BFF, and a pointer to the Load Balancing chapter.

## phase8/scalability
- Load balancing condensed to a short overview with a pointer to the new chapter.
- Wrong: "PostgreSQL caches plans globally" → no result cache; MySQL query cache removed in 8.0. Connection-count claim corrected. PgBouncer transaction-mode caveats added.
- Shard-key advice fixed: hash time-ordered IDs; no `% N`.
- Sliding-window limiter code had a race and a same-millisecond member collision → Lua script (tested). Stampede lock got bounded retries and negative caching (tested).
- BullMQ: attempts:3 = 2 retries (2 s, 4 s), plus the noeviction requirement. connect-redis v8 import, real INSERT. "Resilience4j is Netflix's" was wrong. Fallacies attribution (Deutsch/Gosling). Diagram fixes.

## phase8/caching-and-cdn
- New section: CDN cache keys, query-param fragmentation, Vary, cache poisoning via unkeyed headers, Set-Cookie, `CDN-Cache-Control`. New q3 on cache keys.
- Wrong recipe `public, s-maxage=300, private, max-age=0` (contradictory) → `public, max-age=0, s-maxage=300`.
- XFetch implementation was not XFetch (ad hoc formula, NaN on a miss) → correct delta/expiry version (tested). Jitter comment said ±10% but the code only added → fixed.
- Speed-of-light math (≥~110 ms RTT Tokyo–Virginia), anycast, tiered cache / origin shield. Cache-aside diagram had the DB writing to the cache. Read-through dependency wording. `immutable` vs hard reload. Surrogate-Key/Cache-Tag per vendor. Fabricated Redis "write-back origin" removed. LFU explanation was garbled → rewritten; q9 now mentions the decaying counter.

## phase8/message-queues-and-streaming
- Was missing → added KRaft (ZooKeeper removed in Kafka 4.0), KIP-848, KIP-932 share groups, ISR / min.insync.replicas, ordering only within a partition.
- Exactly-once scope: EOS covers Kafka→Kafka only; external side effects need idempotency. New q5. Removed the "20–30% overhead" figure.
- Code bugs: `redis.setnx(key,'1','EX',…)` was invalid, and marking before sending meant a failed send was silently skipped → mark after success plus provider key. The idempotency pattern was rewritten as claim/confirm (tested).
- BullMQ needs `maxRetriesPerRequest:null`; added UnrecoverableError; jobId dedup is temporary; backoff comment fixed. KafkaJS is unmaintained (noted); idempotent producer on.
- Adding partitions remaps keys. Offset-out-of-range behaviour fixed. Schema-registry compatibility modes were wrong (BACKWARD vs FORWARD). ksqlDB is not PG (labelled; Flink SQL noted). SQS FIFO nuance. All quiz answers had been B → spread.

## phase8/rate-limiting
- Wrong: NGINX `limit_req` is a leaky bucket, not a sliding window; redis-cell is GCRA, not a CRDT; GitHub/Cloudflare don't use token bucket. Added the GCRA explanation (leaky bucket as a meter vs a queue).
- "~4% error" → Cloudflare's measured 0.003%. Sliding-window example timeline fixed.
- Token bucket code: HMSET → HSET; returns remaining and the exact Retry-After; headers set (tested).
- RFC 6585 says Retry-After is optional. X-RateLimit-* is de facto (IETF RateLimit draft). X-Forwarded-For: walk from the right / trust proxy (the old text said leftmost — wrong). `@nestjs/throttler`.
- q4's rationale was wrong (INCR race) → the real issue is a crash between INCR and EXPIRE.

## phase8/consistent-hashing
- Arc example was wrong (server at 200 owns 40%, not 58%) → text fixed and q4 answer changed.
- Add-server diagram percentages were inconsistent → 19% for that example.
- "V=150 → 2–5% imbalance" → measured ~10–12% over fair share (1/√V). The example output comments were made up → replaced with the real output.
- Quorum formulas: ceil(R/2) and ceil(N/2)+1 were wrong → ⌊R/2⌋+1. The code's `quorumReadCount` returned 3 for R=3 → fixed (now prints 2/3).
- Cassandra default num_tokens is 16 since 4.0. DynamoDB service ≠ Dynamo ring (it splits ranges). Redis Cluster is a slot map, not a ring (q8 rewritten). Fake Java "gossip" library → Guava consistentHash. HAProxy hash-type.
- New section: rendezvous, jump hash, Maglev, bounded loads.

## Unsure / worth a second look
- Exact current facts I'm confident in but couldn't verify live: Istio ambient GA timing (late 2024), Kafka 4.0 share groups being "early access", connect-redis v8 named export, Snowflake result-cache 31-day cap, Cloudflare's 0.003% figure.
- PG 18-only features (skip scan, checksums default, EXPLAIN BUFFERS default) were reasoned about, not executed (local PG 14).
- Kafka/Elasticsearch/gateway snippets are syntax- and logic-checked with stubs, not run against real clusters.
