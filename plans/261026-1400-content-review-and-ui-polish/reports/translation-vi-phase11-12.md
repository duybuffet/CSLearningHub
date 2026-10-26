# Translation VI — phase11-12

Validator: `node scripts/validate-translations.mjs vi phase11/ phase12/` → 10 topics, 0 errors (only warnings: curriculum-titles out of sync, for lead to sync).

- phase11/logic-and-proofs — math terms in Vietnamese (mệnh đề, vị từ, lượng từ, phản chứng, phản đảo, quy nạp); kept modus ponens/tollens, witness. converse/inverse = mệnh đề đảo / mệnh đề phản.
- phase11/combinatorics-counting — hoán vị, tổ hợp, chuồng bồ câu, bao hàm–loại trừ; kept "stars and bars", derangement (glossed "mất thứ tự"). Quiz q4 explanation was a pure formula, so a short Vietnamese lead-in was added to clear the untranslated check.
- phase11/graph-theory-basics — kept vertex/edge/path/cycle/tree/forest in English; bậc (degree), bổ đề bắt tay, đồ thị hai phía, sắc số. Eulerian/Hamiltonian kept in English.
- phase11/probability-for-cs — kỳ vọng, phương sai, biến chỉ báo; kept prior/likelihood/posterior (glossed once), Las Vegas/Monte Carlo. Medical terms: độ nhạy / độ đặc hiệu.
- phase11/sets-relations-functions — đơn ánh/toàn ánh/song ánh, quan hệ tương đương, thứ tự bộ phận, tập thương, lực lượng. Kept the SQL keywords and Union-Find.
- phase12/complexity-classes-p-np — kept P/NP/NP-complete/NP-hard, reduction, certificate, verifier, PTAS/FPT. Barrier names (relativisation, natural proofs, algebrisation) kept in English.
- phase12/context-free-grammars — title kept English (it is a term). Kept non-terminal/terminal/production/derivation/parse tree; ambiguity = nhập nhằng.
- phase12/finite-automata — title kept English. Kept state/transition/subset construction/Thompson's construction.
- phase12/regular-languages-and-regex — the `code_concept` label became "Khái niệm". The escaped-backslash code spans were kept byte-for-byte.
- phase12/turing-machines-computability — decidable = quyết định được, recognisable = nhận dạng được (RE/co-RE kept), định lý Rice, luận đề Church-Turing.

Unsure: "Turing-nhận dạng được" reads a bit heavy, but it is the closest natural form. The code_example labels "Example" became "Ví dụ" for consistency.
