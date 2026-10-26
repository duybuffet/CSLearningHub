# Vietnamese translation — phase08 (System Design)

Validator: `node scripts/validate-translations.mjs vi phase8/` → 11/11 overlays, 0 errors (only curriculum-titles sync warnings, left for the lead).

- api-design-styles — title "Các phong cách thiết kế API (API Design Styles)". Kept REST/GraphQL/gRPC terms (resolver, persisted query, field number, trailer) in English. Phrasing call: "over-fetching/under-fetching" kept as-is.
- architecture-patterns — title "Các pattern kiến trúc (Architecture Patterns)". Glossed "big ball of mud (cục bùn lớn)", "cross-cutting concerns (mối quan tâm xuyên suốt)". "distributed monolith" / "modular monolith" kept in English.
- caching-and-cdn — title "Caching và CDN". "stale" rendered as "cũ"; directives (`no-cache`, `s-maxage` …) untouched. "cache poisoning" kept in English.
- consistent-hashing — title kept in English. "clockwise" = "theo chiều kim đồng hồ"; "arc" = "cung". Bounded loads / rendezvous / jump / Maglev names kept.
- load-balancing — title kept. Translated table cell text, kept the columns. Glossed "herding (hiệu ứng bầy đàn)". "fail open", "panic threshold", "slow start" and "split brain" kept in English.
- message-queues-and-streaming — title "Message Queue và Streaming". Glossed "at-most-once / at-least-once / exactly-once" once ("giao nhiều nhất một lần" …), "exactly-once effect (tác dụng đúng một lần)".
- microservice-patterns — title "Các pattern microservice (Microservice Patterns)". "compensating transaction (transaction bù trừ)", "pivot transaction" and "semantic lock" kept. "Microservice Premium" kept as a proper name.
- observability-basics — title "Observability cơ bản (Observability Basics)". "page" rendered as "gọi người"; "burn rate", "error budget", "alert fatigue (mệt mỏi vì cảnh báo)" glossed once. "runbook" kept.
- rate-limiting — title kept. "request budget (hạn mức request)" and "lazy refill" glossed. Analogy: freeway on-ramp meter → "đèn điều tiết ở lối nhập cao tốc".
- scalability — title kept. "vertical/horizontal scaling" = "mở rộng dọc/ngang" (English kept in parentheses at first use). "Fallacies of Distributed Computing" = "Các ngộ nhận về điện toán phân tán".
- system-design-case-studies — title "Case study thiết kế hệ thống (System Design Case Studies)". Quiz q8 options are Redis commands, left unchanged. "write amplification (khuếch đại ghi)" glossed. Unsure: "mise en place" kept with the gloss "khay sơ chế sẵn".
