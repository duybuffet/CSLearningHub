# Translation VI — phase13-14

Validator: `node scripts/validate-translations.mjs vi <slug>` → 0 errors for all 11 topics. The only warnings left say curriculum-titles is out of sync; the lead syncs titles.

## phase13
- abstract-syntax-trees — title kept "Abstract Syntax Trees". The "Template literals" paragraph (section #11) is now translated, after the validator fix.
- interpreters-and-compilers — title "Interpreter và Compiler". Kept JIT/AOT/bytecode/warmup/deoptimisation/inline cache in English.
- lexing-and-parsing — title "Lexing và Parsing". The ASI sentence in callout #5 is now translated, after the validator fix. Error types are translated as "lỗi lexical / lỗi cú pháp / lỗi ngữ nghĩa".
- programming-paradigms — title kept. Paradigm names kept in English (imperative, functional, declarative…). "side effect", "pure function" and "closure" are kept in English.
- type-systems — title kept. Kept static/dynamic, strong/weak, soundness, narrowing, variance in English.

## phase14
- consensus-raft-paxos — title "Consensus: Raft và Paxos". "Phase 1/2" is rendered as "Pha 1/2". Kept term, quorum, ballot, safety/liveness in English.
- consistency-models — title kept. "Session guarantee" is kept in English.
- crdts-eventual-consistency — title "CRDT và Eventual Consistency". Glossed "join-semilattice" only by context, with no extra gloss. "inflationary" is kept in English.
- distributed-systems-fundamentals — title "Nền tảng hệ phân tán (Distributed Systems Fundamentals)". "Eight Fallacies" is translated as "Tám ngộ nhận…" with the English name in parentheses once. "Two Generals" becomes "Bài toán Hai vị tướng (Two Generals)".
- logical-clocks-and-ordering — title "Logical clock và thứ tự sự kiện (Logical Clocks and Ordering)". Kept happens-before, vector clock, version vector, HLC in English.
- replication-and-partitioning — title "Replication và Partitioning". Kept hotspot, scatter-gather, hinted handoff, sloppy quorum, rebalancing in English.
