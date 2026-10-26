# Translation VI — phase19-20

Validator: `node scripts/validate-translations.mjs vi phase19 phase20` → 9/9 topics, 0 errors (only warnings: curriculum-titles out of sync, for lead to sync).

- phase19/ci-cd-pipelines — title kept "CI/CD Pipelines". Glossed "artifact immutability (tính bất biến của artifact)", "Principle of least privilege (nguyên tắc đặc quyền tối thiểu)". DORA metric names kept English.
- phase19/deployment-strategies — title kept. Glossed "blast radius (phạm vi ảnh hưởng)". Analogy "motorway/tollgates" → cao tốc/trạm thu phí; transponder → "thiết bị định danh trên xe".
- phase19/logging-and-distributed-tracing — title kept. "critical path (đường găng)" glossed once. Span/trace/attribute/cardinality kept English.
- phase19/monitoring-and-metrics — title kept. RED/USE signal names (Rate, Errors, Duration, Utilisation, Saturation) kept English; "alert fatigue (mệt mỏi vì cảnh báo)", "burn rate (tốc độ đốt budget)" glossed.
- phase19/sre-and-reliability — title kept. Toil, error budget, burn rate, postmortem, Incident Commander kept English; "blameless" glossed as "không đổ lỗi"; "just culture" glossed "văn hóa công bằng". Code-example label "Prometheus rules" → "Rule Prometheus".
- phase20/how-llms-work — title → "LLM hoạt động thế nào" (descriptive, like "How Browsers Work"). ML terms kept English (token, embedding, attention, KV-cache, prefill/decode, RLHF, DPO, MoE). "emergent" glossed "năng lực tự xuất hiện".
- phase20/machine-learning-basics — title kept. Supervised/unsupervised/reinforcement learning kept English with one-time gloss (học có giám sát/không giám sát/tăng cường). Quiz q1 options are term names → unchanged.
- phase20/ml-systems-in-production — title → "Hệ thống ML trên production (ML Systems in Production)". Champion/challenger kept English; "watermarking", "point-in-time join" kept English; "khoảng ân hạn" for grace period.
- phase20/neural-networks-intro — title → "Nhập môn Neural Network (Neural Networks Introduction)". Unsure: whether the title should stay fully English like other term titles; chose descriptive translation since "Introduction" is descriptive. "chain rule" kept English with gloss "quy tắc chuỗi".

Notes: numbers kept in original format (e.g. 23,000; 43.2) — not converted to Vietnamese thousand separators.
