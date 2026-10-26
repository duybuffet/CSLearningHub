# Vietnamese translation — phase02

Validator: `node scripts/validate-translations.mjs vi phase2/` → 6/6 topics, 0 errors (only warning: curriculum-titles out of sync — lead runs sync-translated-titles).

- phase2/big-o-complexity.json — title kept "Big-O Complexity". Glossed "amortised analysis (phân tích khấu hao)" once. Kept best/average/worst case, trade-off, amortised in English; "cận trên/cận dưới/cận chặt" for upper/lower/tight bound.
- phase2/functions-scope-closures.json — title "Hàm, Scope & Closure". Kept scope, closure, binding, hoisting, TDZ, call-by-sharing, HOF, pure function in English; glossed IIFE once. Unsure: "closes over" rendered as "đóng gói" (biến) — natural enough but not a standard term.
- phase2/garbage-collection.json — title "Garbage Collection & quản lý bộ nhớ". Tri-color colours translated (trắng/xám/đen); kept mark-sweep/compact, scavenge, promote, write barrier, remembered set, card table, root, reachable/live in English. TC39 quote kept in English with Vietnamese gloss in parentheses.
- phase2/memory-stack-heap.json — title "Bộ nhớ: Stack & Heap". Kept primitive, reference type, shallow/deep clone, binding, freeze in English.
- phase2/object-oriented-programming.json — title "Lập trình hướng đối tượng (OOP)". Pillars kept in English with one-time Vietnamese gloss (encapsulation — đóng gói, etc.). Joe Armstrong quote kept in English + Vietnamese gloss. "Tell, don't ask" kept + gloss.
- phase2/recursion.json — title "Đệ quy (Recursion)". Glossed memoization once ("ghi nhớ kết quả đã tính"), "leap of faith (bước nhảy niềm tin)", divide and conquer (chia để trị), backtracking (quay lui). Kept base case / recursive case / unwind / tail call in English.
