# Fact-check B: verdicts on claims written from memory

Checked 2026-10-26. Verdicts: **correct** (left as is, sometimes with a date added), **fixed** (the text was wrong or imprecise), **softened**. Nothing needed softening: every claim could be checked against a primary source.

| # | Claim | Verdict | Source | Files changed |
|---|---|---|---|---|
| 1 | OWASP Top 10:2025 list and numbering, SSRF folded into A01, XSS under Injection, "8th edition", "2.8 million apps", A03 extends A06:2021 | **correct**. All ten names and numbers match. The list was presented in Nov 2025 and finalized in Jan 2026. | https://top10.owasp.org/2025/0x00_2025-Introduction/ , https://top10.owasp.org/2025 | none |
| 2a | PQ hybrid X25519MLKEM768 is on by default | **fixed (made precise)**. Added versions: Chrome 131+, Firefox desktop 132+, Safari and Apple's system TLS stack in iOS/macOS 26+, and OpenSSL 3.5+. Apple's own documents say the system TLS stack (URLSession/Network) turns it on by default in OS 26. Safari runs on that stack. | https://support.apple.com/guide/security/sec100a75d12/web , https://support.apple.com/en-gb/122756 , https://www.firefox.com/en-US/firefox/132.0/releasenotes/ | phase16/tls-and-https-internals.json |
| 2b | ECH is enabled in Chrome and Firefox and supported by Cloudflare | **correct**. Added "standardized as RFC 9849 (March 2026)". | https://datatracker.ietf.org/doc/rfc9849/ | phase16/tls-and-https-internals.json |
| 2c | SC-081: 200 days from Mar 2026, 100 days in 2027, 47 days in 2029. Let's Encrypt issues 90-day certificates plus optional ~6-day ones. | **correct**. The 6-day certificates became generally available on 2026-01-15 as an opt-in. The default stays 90 days and drops to 45 days by Feb 2028. | https://letsencrypt.org/2026/01/15/6day-and-ip-general-availability , https://letsencrypt.org/docs/cert-lifetimes/ | none |
| 2d | Let's Encrypt shut down OCSP in 2025. CA/B Forum made OCSP optional and CRLs mandatory in 2023. | **correct** (ballot SC-063 passed in 2023, and the LE responders went off in Aug 2025) | https://letsencrypt.org/2024/12/05/ending-ocsp/ | none |
| 3a | NIST SP 800-63B-4: min 15 characters (single-factor) or 8 (with MFA), allow ≥64, no composition rules, no periodic rotation, a phishing-resistant option offered at AAL2 | **correct**. Added the final publication date (July 31, 2025). | https://pages.nist.gov/800-63-4/sp800-63b.html , https://csrc.nist.gov/pubs/sp/800/63/B/4/final | phase16/authentication-and-authorization.json |
| 3b | RFC 9700 (Jan 2025): PKCE required for public clients and recommended for confidential ones, PKCE can replace `state` for CSRF, exact redirect-URI matching, refresh tokens of public clients rotated or sender-constrained. OAuth 2.1 is still a draft. | **correct**. One fix: the explanation for quiz q4 said "the state parameter (not PKCE) prevents CSRF", which contradicted the article. It now says PKCE can double as CSRF protection only when the server is known to enforce it. | https://www.rfc-editor.org/rfc/rfc9700 | phase16/authentication-and-authorization.json |
| 4 | 2025 npm incidents | **fixed**. The text said "phished maintainer *accounts* … chalk, debug and *dozens more*". In fact one phished maintainer (qix) was used on **Sept 8, 2025** to push crypto-stealing versions of **18** packages (~2B weekly downloads). Shai-Hulud followed about Sept 14–16: it stole npm and GitHub tokens and republished hundreds of packages. Added the "Shai-Hulud 2.0" wave of Nov 2025. The quiz explanation was also fixed. The owasp-top-ten file has no incident details, so it needed no change. | https://www.theregister.com/2025/09/08/dev_falls_for_phishing_email , https://www.zscaler.com/blogs/security-research/mitigating-risks-shai-hulud-npm-worm | phase16/secure-coding-practices.json |
| 5a | `scheduler.yield()` described as Chromium-only ("Chromium 129+", "fallback elsewhere") | **fixed**. Firefox has shipped it since **142**. Safari still lacks it. Updated all 6 mentions. | MDN browser-compat-data `api/Scheduler.json` (yield: chrome 129, firefox 142, safari false) | phase17/dom-and-rendering-pipeline.json, phase17/javascript-event-loop.json, phase17/web-performance-optimization.json |
| 5b | Chrome reversed its third-party-cookie removal in 2024–25 and still allows them by default | **correct** | https://privacysandbox.com/news/ | none |
| 5c | Chromium caps the preflight cache (`Access-Control-Max-Age`) at 7200 s, Firefox at 86400 s | **correct** | https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Access-Control-Max-Age | none |
| 5d | INP: the worst interaction ignoring 1 per 50 (≈p98), good ≤200 ms, judged at p75, replaced FID in March 2024 | **correct** | https://web.dev/articles/inp | none |
| 6 | Cloudflare: 0.003% of 400M requests wrongly allowed or limited. NGINX `limit_req` is a leaky bucket. redis-cell implements GCRA. | **correct** (quote matches: 400M requests from 270k sources) | https://blog.cloudflare.com/counting-things-a-lot-of-different-things/ , https://nginx.org/en/docs/http/ngx_http_limit_req_module.html , https://github.com/brandur/redis-cell | none |
| 7 | Snowflake result cache lasts 24 h, extended on each reuse up to 31 days | **correct** | https://docs.snowflake.com/en/user-guide/querying-persisted-results | none |
| 8 | Kafka 4.0 (2025) removed ZooKeeper. KIP-848 is GA. Share groups are early access. | **correct, updated**. Added that share groups ("Queues for Kafka") became **production-ready in Kafka 4.2 (Feb 2026)**. | https://kafka.apache.org/blog/2026/02/17/apache-kafka-4.2.0-release-announcement/ | phase8/message-queues-and-streaming.json |
| 9a | Redis moved to RSALv2/SSPLv1 from 7.4 (Mar 2024). Valkey is a BSD fork of 7.2.4. Redis 8 added AGPLv3 (2025). Elastic: SSPL/ELv2 in 2021, OpenSearch fork, AGPL in 2024, OpenSearch Software Foundation in 2024. | **correct** | https://redis.io/blog/agplv3/ , https://www.elastic.co/blog/elasticsearch-is-open-source-again | none |
| 9b | connect-redis v8 named import (`import { RedisStore }`) | **correct, with a caveat added**. The latest release is v10. **v9 dropped ioredis support**, and the example passes an ioredis client. The comment now warns that v9+ needs a node-redis v5 client. This change is outside phase7 (in phase8/scalability.json): a one-line code comment. | https://github.com/tj/connect-redis/releases (v8.0.0, v9.0.0) | phase8/scalability.json |
| 10 | PostgreSQL 18 (2025-09-25): B-tree skip scan, data checksums on by default in initdb, `uuidv7()`, async I/O | **correct**. Of these, only skip scan, checksums and uuidv7 appear in the content, in acid-indexes, database-storage-internals and normalization-and-data-modeling. transaction-isolation-levels mentions none of them. | https://www.postgresql.org/docs/release/18.0/ | none |
| 11a | Discord moved Cassandra → ScyllaDB "(2022–2023)", and unbounded partitions were "the exact problem Discord hit before moving" | **fixed**. Discord cut over in **May 2022** and wrote it up in **March 2023**. Discord already used channel + time buckets in Cassandra. The move was driven by hot partitions, JVM GC pauses and unpredictable latency, not by unbounded partitions. There was no Discord text in phase14; it was in phase8. | https://discord.com/blog/how-discord-stores-trillions-of-messages | phase8/system-design-case-studies.json |
| 11b | "Figma's multiplayer engine is CRDT-inspired" | **correct**. Figma says it is "inspired by" CRDTs but does not use true CRDTs. | https://www.figma.com/blog/how-figmas-multiplayer-technology-works/ | none |
| 11c | OTel profiles are "being added as a fourth signal" | **fixed (made precise)**. Added that profiles entered **public Alpha in March 2026** and are not stable yet. | https://opentelemetry.io/blog/2026/profiles-alpha/ | phase8/observability-basics.json |
| 12a | CPython JIT: experimental build option in 3.13. The 3.14 Windows/macOS binaries include it, off by default (`PYTHON_JIT=1`). | **correct**. Also filled a gap: 3.14 made the free-threaded build officially supported (PEP 779), but it is still an optional separate build. | https://docs.python.org/3.14/whatsnew/3.14.html | phase13/interpreters-and-compilers.json |
| 12b | V8 "moving TurboFan from sea of nodes to Turboshaft". Wasm pair "Liftoff and TurboFan". | **fixed (made precise)**. As of Mar 2025, TurboFan's whole JS backend and the whole Wasm pipeline run on Turboshaft, and the JS frontend is being replaced by Maglev's CFG. | https://v8.dev/blog/leaving-the-sea-of-nodes | phase13/interpreters-and-compilers.json |

## Files changed
- src/content/phase16/secure-coding-practices.json
- src/content/phase16/tls-and-https-internals.json
- src/content/phase16/authentication-and-authorization.json
- src/content/phase17/dom-and-rendering-pipeline.json
- src/content/phase17/javascript-event-loop.json
- src/content/phase17/web-performance-optimization.json
- src/content/phase8/message-queues-and-streaming.json
- src/content/phase8/observability-basics.json
- src/content/phase8/system-design-case-studies.json (Discord text was here, not in phase14)
- src/content/phase8/scalability.json (connect-redis comment only)
- src/content/phase13/interpreters-and-compilers.json

## Validation
For all 11 changed topics, `validate-content.mjs` and `validate-mermaid-diagrams.mjs` both report 0 errors and 0 failed diagrams.

## Less certain
- Safari's PQ default comes from Apple's statement about the OS-wide TLS stack. Apple's documents do not name Safari in that statement.
- The Shai-Hulud package counts differ by source (200–500+), so the text says "hundreds".
