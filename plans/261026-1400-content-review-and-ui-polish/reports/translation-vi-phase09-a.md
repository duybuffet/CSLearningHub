# Translation VI — phase09-a

Validator: `node scripts/validate-translations.mjs vi phase9/<slug>` → 0 errors for all 9 files (only warning: curriculum-titles sync, left for lead).

- **singleton** — title kept "Singleton Pattern". Kept GoF intent quote in English + VI gloss in parentheses. "shared mutable state" glossed once.
- **factory-method** — kept "simple factory", "static factory method", "factory function", "registry" in English. Glossed "extension point (điểm mở rộng)". GoF intent quote kept EN + VI gloss.
- **abstract-factory** — "family" rendered as "họ" (họ product, nhất quán trong họ). "composition root" glossed once (điểm lắp ráp). One inline-code issue fixed: `MacFactory()` span had to stay separate from "new".
- **builder** — "telescoping constructor", "fluent API", "Director", "options object" kept in English. Error-message strings inside quotes kept English. GoF intent quote EN + VI gloss.
- **adapter** — participant names (Target Interface, Adaptee, Client) kept English, incl. quiz options. "Ports and Adapters / Hexagonal" kept; driving/driven adapter kept English.
- **decorator** — "cross-cutting concern" glossed once (mối quan tâm cắt ngang); "subclass explosion" glossed (bùng nổ subclass). "delegate" rendered as "chuyển tiếp" (avoided "giao tiếp", which reads as "communicate"); "giao cho" used where natural.
- **facade** — "God object/God Facade", "BFF", "barrel export" kept English. "compensation" → "bù trừ".
- **proxy** — variant names (Virtual/Protection/Caching/Remote Proxy), "trap", "single-flight", "thundering herd", write-through/around/behind kept English. Joke quote about cache invalidation kept EN + VI gloss.
- **composite** — "leaf", "composite", "transparent/safe" kept English (with "trong suốt/an toàn" gloss once). "part-whole" → "bộ phận-toàn thể"; "bill-of-materials" glossed as "bảng định mức vật tư".

Workflow note: drafts written with `@@Fn@@` placeholders for fenced code blocks, merged byte-for-byte from the skeleton by a scratch script; quiz code fence in decorator q6 copied verbatim and verified identical.
