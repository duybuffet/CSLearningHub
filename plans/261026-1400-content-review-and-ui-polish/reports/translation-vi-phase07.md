# Vietnamese translation — phase07

Validator: `node scripts/validate-translations.mjs vi phase7/` → 8 topics, 0 errors (only "curriculum-titles out of sync" warnings, for the lead's title sync).

- **acid-indexes** — title "ACID, Transaction & Index". "all-or-nothing" → "được ăn cả, ngã về không". Glossed "invariant" once as "bất biến (invariant)". Kept the 3 isolation-anomaly names in English.
- **caching-and-search-stores** — title "Caching và search store". Kept eviction policy names, TTL, stampede/thundering herd, posting list and BM25 in English. Kept the Phil Karlton quote in English and added a Vietnamese gloss in parentheses. In the q9 options I translated only the joining words ("rồi ngay sau đó", "nếu nil thì") and left the commands as they were.
- **database-storage-internals** — title "Bên trong tầng lưu trữ của database (Database Storage Internals)". Kept page, buffer pool, dirty page, MemTable/SSTable, compaction, write/read/space amplification and tombstone in English. "torn page" → "torn (rách)", glossed once.
- **normalization-and-data-modeling** — title kept in English. "fact" → "sự kiện (fact)", glossed once. Kept the normal-form vocabulary in English (functional dependency, candidate key, prime attribute, determinant, lossless). Translated the markdown table cells and kept the data values (names, course codes) as they were. Not sure about "smell" → "dấu hiệu thiết kế tồi".
- **oltp-vs-olap** — title kept. Kept tool and product names, star/snowflake schema, fact/dimension table, partition pruning and zone map in English. "wildcard" (DuckDB) → "quân bài bất ngờ".
- **sql-nosql-cap** — title "SQL vs NoSQL & định lý CAP". Kept the blockquote formatting. Kept the PACELC letter emphasis (**P**artition, **E**lse) and added "(ngược lại)".
- **sql-queries-and-joins** — title "SQL query & join". Fenced code blocks were replaced with placeholders while translating, then restored byte-for-byte. Translated the table headers in the NULL truth table ("Biểu thức | Kết quả"). Kept SQL keywords and plan node names in English. "sargable" left untranslated.
- **transaction-isolation-levels** — title kept. Kept all anomaly names (dirty/non-repeatable/phantom read, lost update, read/write skew), SSI terms (rw-anti-dependency, SIREAD lock) and "idle in transaction" in English. "dangerous structure" → "cấu trúc nguy hiểm", kept in quotes.
