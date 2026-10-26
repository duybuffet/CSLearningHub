# Vietnamese translation — phase04 (12 topics)

Validator: `node scripts/validate-translations.mjs vi phase4/` → 12/12 present, **0 errors**; 6 warnings, all "curriculum-titles out of sync" (lead runs sync-translated-titles).

- backtracking — title kept "Backtracking". Glossed prune (cắt tỉa), backtrack (quay lui), choice point (điểm lựa chọn), constraint propagation (lan truyền ràng buộc) once each.
- binary-search — title kept. "Invariant (bất biến)" glossed once. lower/upper bound, answer-space kept in English.
- bit-manipulation — title kept. Truth table = "bảng chân trị"; two's complement = "bù hai"; sign extension kept in English.
- divide-and-conquer — title kept; glossed "chia để trị" once. Recurrence = "hệ thức truy hồi"; master theorem kept. Inversion = "nghịch thế", split inversion glossed.
- dynamic-programming — title kept; "quy hoạch động" used in prose. overlapping subproblems / optimal substructure given as "bài toán con chồng lặp" / "cấu trúc con tối ưu" with the English term on first use.
- greedy-algorithms — title kept. greedy choice property, exchange argument, matroid kept in English (glossed once). Section title "Booking the Taxi Fleet With the Shortest Rides First" translated literally, even though the section goes on to argue shortest-first is wrong (the English heading is misleading, maybe worth fixing at the source).
- math-for-algorithms — title "Toán cho thuật toán (Math for Algorithms)". Sieve = "sàng", modular inverse = "nghịch đảo modulo", coprime = "nguyên tố cùng nhau".
- minimum-spanning-tree — title "Cây khung nhỏ nhất (Minimum Spanning Tree)". cut/cycle property kept in English. Inline-code cut definitions (e.g. `(S = component containing u, ...)`) had to stay English per the validator, so I added a Vietnamese paraphrase in parentheses right after each one.
- shortest-path-algorithms — title "Thuật toán đường đi ngắn nhất (Shortest Path Algorithms)". "settle" = "chốt"; stale entry = "phần tử cũ"; relaxation kept (glossed "nới lỏng" once).
- sorting-algorithms — title kept. stable = "ổn định"; natural run, minRun kept in English.
- string-matching-algorithms — title "Thuật toán so khớp chuỗi (String Matching Algorithms)". proper prefix = "tiền tố thực sự"; border, failure function kept.
- topological-sort — title kept; glossed "sắp xếp topo" once. in-degree glossed "bậc vào"; critical path = "đường găng".
