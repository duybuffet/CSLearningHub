# Translation VI — phase09-b

- **observer** — Kept Subject/Observer/push/pull/fan-out in English. Rendered "notification chain" as "chuỗi thông báo (notification chain)" (glossed once). Translated "tearing" by explaining it in place.
- **strategy** — Kept Context/ConcreteStrategy/duck typing/DI. Translated "compose behaviour, don't inherit it" as "ghép hành vi, đừng kế thừa hành vi". Translated "fragile base class" by leaving it in English.
- **command** — Kept Invoker/Receiver/undo/redo stack/outbox/at-least-once/idempotent. Translated "compensating command" as "command bù trừ". Wrote "this happened" (Redux style guide) as “việc này đã xảy ra”.
- **state** — Kept guard/entry action/exit action/statechart/transition. Translated "State-driven / Context-driven" as "do State điều khiển / do Context điều khiển". Translated "shotgun surgery" by leaving it in English.
- **iterator** — Kept iterable/iterator/generator/lazy/eager/pull/push. Rendered "materialise" as "hiện thực hóa", which felt slightly stiff but is the clearest option. Inline code containing escaped surrogates (`'\uD83D'`) was kept byte-for-byte.
- **template-method** — Translated "skeleton" as "bộ khung", "hook" stayed in English, and "default step" became "bước mặc định". Translated the Strategy comparison table cell by cell and kept its columns. Rendered "Hollywood principle" as "nguyên tắc Hollywood".
- **design-patterns-in-the-wild** — Title became "Design pattern ngoài thực tế (Design Patterns in the Wild)". Translated "onion model" as "mô hình củ hành". Kept "Pipes and Filters", "Active Record" and "Data Mapper" in English.
- **anti-patterns-and-tradeoffs** — Title became "Anti-pattern và trade-off", and the curriculum titles need syncing. Kept "pattern fever", "God Object", "Rule of Three" and "YAGNI/KISS" in English. Rendered "spaghetti causality" as "quan hệ nhân quả kiểu mì spaghetti".

Validator: all 8 files report 0 errors.
