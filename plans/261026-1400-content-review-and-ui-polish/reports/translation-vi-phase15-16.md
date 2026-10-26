# Translation VI — phase15-16

All 10 overlays validated: `node scripts/validate-translations.mjs vi phase15/ phase16/` → 0 errors (warnings = curriculum-titles sync only, for lead).

- phase15/async-and-event-loop — title "Async và Event Loop"; kept microtask/macrotask/tick/phase names in English; "starvation" rendered "làm chết đói" + term kept (microtask starvation).
- phase15/concurrency-vs-parallelism — title kept English; Rob Pike quote kept in English with VI gloss in parentheses; "embarrassingly parallel" glossed once.
- phase15/actor-and-message-passing — "let it crash" kept English + gloss; supervision strategy names (one-for-one…) kept; CSP table cells translated, columns kept.
- phase15/lock-free-and-atomics — memory-order names (acquire/release/seq_cst), ABA, CAS, wait-free/lock-free kept English; "descheduled" → "bị đẩy ra khỏi lịch chạy".
- phase16/authentication-and-authorization — AuthN/AuthZ, session, token, claim, scope, PKCE, IDOR kept English; hotel/valet analogy adapted.
- phase16/cryptography-fundamentals — "public/private key" kept English, "khóa" used for generic crypto keys; confusion/diffusion glossed; "trapdoor one-way function" glossed.
- phase16/hashing-and-digital-signatures — "non-repudiation" → "chống chối bỏ"; preimage/collision resistance → "kháng preimage/collision".
- phase16/owasp-top-ten — all OWASP category names left in English (table + lists); "fail open" glossed once.
- phase16/secure-coding-practices — blast radius → "bán kính thiệt hại (blast radius)"; supply chain → "chuỗi cung ứng"; STRIDE terms kept English.
- phase16/tls-and-https-internals — handshake message names, cipher suite names, HSTS/OCSP/ECH kept; "harvest now, decrypt later" kept + gloss.

Unsure: none blocking. Only judgement calls were mixing "khóa" vs "key" in crypto topics (used "public key/private key/session key" in English, "khóa" for generic mentions).
