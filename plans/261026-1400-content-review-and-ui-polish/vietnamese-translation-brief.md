# Vietnamese Translation Brief — CS Learning Hub

The site owner is a Vietnamese software engineer re-learning CS for themselves. They read English
fine but miss nuance in long passages. The Vietnamese version must read like a good Vietnamese
engineer explaining the idea to a colleague — **natural Vietnamese, not word-by-word**, with
**technical terms kept in English**.

## Files and workflow
For each assigned English topic `src/content/<phase>/<slug>.json`:
1. `node scripts/extract-translation-skeleton.mjs vi <phase>/<slug>.json` → creates
   `src/content/vi/<phase>/<slug>.json` with the English text in place.
2. Translate every string value in that file **except** `sourceHash`, `type`, quiz `id`.
   Write the finished JSON (Write tool or a Node script). Keep the exact structure: same number of
   sections in the same order, same `items` count, same quiz order and option order.
3. `node scripts/validate-translations.mjs vi <slug>` must report 0 errors. It fails if structure
   differs, a long field was left in English, or any code was changed.
Only create files under `src/content/vi/` for your assigned topics. Never edit English files,
`curriculum.json` or `vi/curriculum-titles.json` (the lead syncs titles).

## What stays exactly as is
- Everything inside fenced ``` blocks and inline `code` spans — byte-for-byte (the validator checks).
- Markdown structure: `**bold**`, `*italic*`, lists, tables (translate cell text, keep columns), links.
- Numbers, units, formulas, Big-O, version numbers, product names, RFC/CVE ids.
- Proper names of people, companies, papers, books.

## Terminology — keep in English
Keep established technical terms in English, as Vietnamese engineers say them at work:
stack, heap, queue, hash table, hash function, array, linked list, tree, graph, node, edge, pointer,
reference, cache, cache hit/miss, cache line, register, thread, process, context switch, scheduler,
deadlock, race condition, mutex, lock, semaphore, atomic, event loop, callback, promise, closure,
scope, runtime, compiler, interpreter, garbage collection/collector, memory leak, API, endpoint,
request, response, header, payload, client, server, load balancer, proxy, database, index, query,
transaction, commit, rollback, schema, replication, sharding, partition, consensus, leader, quorum,
latency, throughput, bandwidth, timeout, retry, backoff, idempotent, deploy/deployment, container,
cluster, pod, pipeline, build, test, unit test, mock, refactor, design pattern (and every pattern
name: Singleton, Factory Method, Observer…), framework, library, bug, debug, log, trace, metric,
token, embedding, model, training, inference, prompt, overfitting, gradient descent, Big-O,
amortized, worst case/average case, trade-off, edge case, interview.

Vietnamese words that read naturally and are fine to use: thuật toán, cấu trúc dữ liệu, bộ nhớ,
hệ điều hành, mạng, bảo mật, mật mã, hiệu năng, độ phức tạp, đệ quy, biến, hàm, đối tượng, lớp
(class — but prefer "class" when talking about code), kiểu dữ liệu, giá trị, khóa (only for
crypto keys; use "key" for map keys), tập hợp, xác suất, chứng minh, định lý, đồ thị (ok, "graph" also
fine), ví dụ, sơ đồ (but "diagram" is fine), lỗi.
When a term may be unclear, you may add a short Vietnamese gloss **once** at first use:
"memoization (ghi nhớ kết quả đã tính)". Don't do it for common terms.

## Style
- Address the reader as **"bạn"**. Friendly, direct, precise — like the English.
- Rewrite sentences for Vietnamese flow; split long English sentences; drop filler. Meaning must
  stay exact — never drop a caveat, number or condition, and never add claims.
- Section titles: short, natural. Keep the term if the title is a term ("Hash Collisions" →
  "Hash collision", "The Three Core Operations" → "Ba thao tác cốt lõi").
- Topic `title`: keep English when it's a term or pattern name ("Tries", "Observer Pattern",
  "Dynamic Programming", "Hash Tables"); translate descriptive ones ("Memory Hierarchy" →
  "Phân cấp bộ nhớ (Memory Hierarchy)", "How Browsers Work" → "Trình duyệt hoạt động thế nào").
- Quiz: translate question, every option and explanation; keep option order exactly (answers are
  index-based). Options that are code or numbers stay unchanged.
- Analogies: adapt the wording so it lands in Vietnamese, but keep the same image/idea.
- Tagline: one natural sentence.

## Example
EN: "A **cache miss** occurs when the requested address is not found. The cache must fetch the data
from the next level — a process that stalls the CPU pipeline."
VI: "**Cache miss** xảy ra khi địa chỉ cần đọc không có trong cache. Khi đó cache phải lấy dữ liệu
từ tầng kế tiếp, và trong lúc chờ, pipeline của CPU bị đứng lại."

## Report
When done, append a short line per topic to
`plans/261026-1400-content-review-and-ui-polish/reports/translation-vi-<group>.md` (anything you
were unsure how to phrase, terms you glossed). Final message: list of files created + validator result.
