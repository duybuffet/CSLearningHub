# Content review: cloud-devops-ai (phase18–20, 15 topics)

Result: `node scripts/validate-content.mjs phase18/ phase19/ phase20/` gives **15 topics, 0 errors, 0 warnings**.

How I checked it:
- **JS examples:** every one was run. Ones that need packages (prom-client, pino, express, OpenTelemetry) were run against real installs in the scratchpad. The Lambda handler was run against a stub of the AWS SDK.
- **YAML:** every block was parsed with js-yaml.
- **Mermaid:** every diagram was parsed with mermaid 11.16 (`mermaid.parse` under jsdom).
- **Quiz:** answers are now spread 2–3 per option in every topic. Explanations that referred to option letters were rewritten.

Legend: **Fix** = it was wrong and I changed it. **Add** = gap filled. ⚠ = fact I am less sure of (please spot-check).

---

## Phase 18

### docker-and-containers
- **Fix:** Node 18 is end-of-life → changed to `node:22-alpine`. `npm ci --only=production` is deprecated → `--omit=dev`.
- **Fix:** the multi-stage text and diagram said stage 1 included devDependencies, but it installed production deps only. They now agree. Switched to the built-in `node` user and added a `.dockerignore` note.
- **Fix:** "six namespace types" → Linux has eight (`cgroup` and `time` are the other two).
- **Fix:** the text said cgroups limit network bandwidth. They don't; that is done with `tc` or the CNI. Added `pids` and block I/O.
- **Fix:** digest pinning was said to go in `securityContext` → it goes in `image: …@sha256`.
- **Fix:** the PID 1 caveat was missing. PID 1 gets no default SIGTERM handling, so the app needs a handler, `--init`, or tini.
- **Add:** a Compose v2 callout: use `docker compose`, the `version:` key is obsolete, prefer `compose.yaml`, and `service_healthy` only orders startup.
- **Add:** BuildKit `--mount=type=secret`. `ARG` is not safe for secrets.
- **Add:** a section on OCI, containerd and runc: dockershim was removed in 1.24, plus gVisor, Kata and Podman. Plus a takeaway.

### kubernetes-orchestration
- **Fix:** "Google built it internally under the name Borg" → it was inspired by Borg and Omega. Open-sourced 2014, given to the CNCF in 2015.
- **Fix:** the callout said Borg ran "15 years" before Kubernetes → about a decade. Also said the founders were "Borg's original engineers" → they were Google engineers.
- **Fix:** "Docker, containerd, CRI-O all implement CRI" → Docker Engine does not. It needs `cri-dockerd` because dockershim was removed in 1.24.
- **Fix:** kube-proxy was described as round-robin → iptables mode picks a backend at random; IPVS is round-robin. Added nftables and eBPF (Cilium).
- **Fix:** the kubectl-apply sequence diagram was wrong:
  - It showed the API server persisting ReplicaSets and Pods, and "202 Accepted".
  - It now shows the controllers creating them, watch-based kubelet behaviour, and 201/200.
- **Fix:** the Pod state diagram mixed Pod phases with conditions → phases now sit with Ready/NotReady nested inside Running.
- **Fix:** CrashLoopBackOff timing was given as 1s, 2s, 4s → it is 10s, 20s, 40s… capped at 5 minutes.
- **Fix:** `pod-eviction-timeout` is gone → replaced with taint-based eviction (`tolerationSeconds: 300`).
- **Fix:** graceful shutdown was described as "fail your readiness probe" → it actually works through terminating endpoints plus a `preStop` delay.
- **Fix:** HPA defaults were wrong (scale-up has no stabilization window; there is a 10% tolerance). LoadBalancer on AWS is an NLB, not an ALB.
- **Fix:** the text said namespaces isolate DNS and network traffic. They don't; you need NetworkPolicy.
- **Fix:** the tip said `:latest` isn't re-pulled. In fact `:latest` defaults to `imagePullPolicy: Always`; the real problem is reproducibility and rollback. Also "pin a digest like `:v2.1.0`" — a tag is not a digest.
- **Fix:** CPU-limit guidance was too absolute; it now explains the throttling trade-off.
- **Add:** a Gateway API explanation and YAML example (Gateway + HTTPRoute). ⚠ ingress-nginx retired March 2026.
- **Add:** a security section covering RBAC, Pod Security Admission (PSP was removed in 1.25), NetworkPolicy and Secrets hygiene.
- **Add:** a callout on recent Kubernetes changes, plus 2 takeaways.

### cloud-computing-fundamentals
- **Fix:** Lambda cost math left out the request fee → about $1.03 per million invocations, not $0.83.
- **Fix:** AWS revenue → over $100B. Region count is no longer pinned to a date-sensitive number.
- **Fix:** "AZ round-trip under 1 ms" → single-digit ms. New AWS regions get at least 3 AZs. Added the AZ-ID mapping caveat.
- **Fix:** Equifax was cited as a cloud misconfiguration. It was an unpatched on-premises Struts server. Capital One (SSRF → IMDS credentials → S3) is now explained properly, with IMDSv2.
- **Fix:** RDS failover times corrected (60–120 s; under ~35 s for a Multi-AZ DB cluster). "Sub-second Multi-AZ failover" corrected. The RDS price premium is now 1.5–2× (was 2–3×).
- **Fix:** GCP "Preemptible VMs" → Spot VMs, with ~30 s notice. EB platform "Node.js 18" → current. Noted that S3 Block Public Access has been the default since April 2023. "DB Replica" → standby.
- **Fix:** the cold-start mitigation list now includes SnapStart and ⚠ Aug-2025 INIT billing, and calls keep-warm pings a legacy hack. Runtimes updated.
- **Fix:** sequence diagram cleaned up: removed quoted aliases and the "no outage" claim.

### compute-storage-networking
- **Fix:** the Terraform block was tagged `yaml` → now `hcl`.
- **Fix:** io2 IOPS figures contradicted each other (64k vs 256k) → now 256k for Block Express. ⚠ gp3 ceilings were raised in 2025, so I worded that generically.
- **Fix:** the S3 consistency paragraph said "until recently no strong consistency". Since Dec 2020 S3 has strong read-after-write consistency, including LIST. Added conditional writes.
- **Fix:** q8 explanation still called S3 "eventually consistent"; corrected.
- **Fix:** q10 had two correct options (NACLs really are first-match) → the distractor is now "security groups have deny rules".
- **Fix:** "Docker is the dominant runtime" → in Kubernetes the node runtime is containerd or CRI-O. EC2-Classic was retired in 2023.
- **Fix:** weighted target groups are for canary, not blue/green. Private-subnet wording is now precise. GPU instance list updated (p5/p6). A dubious EFS latency claim was removed.
- **Add:** NAT Gateway cost trap and VPC gateway/interface endpoints. Fully managed node modes (Autopilot, EKS Auto Mode).

### infrastructure-as-code
- **Fix:** the HCL was invalid: `variable "x" { type = number; default = 2 }` (HCL has no `;` separator). Variables rewritten. Both HCL blocks were tagged `yaml` → `hcl`.
- **Fix:** the DynamoDB lock table is deprecated → `use_lockfile = true` (Terraform ≥1.11). Updated text, diagram, takeaway and q3. AWS provider bumped to `~> 6.0`.
- **Fix:** `~> 5.1` was described as "patch updates" → it allows minor updates. Added `.terraform.lock.hcl`.
- **Fix:** "`terraform destroy` has no prompt" → it prompts unless `-auto-approve`.
- **Fix:** `terraform import` → added import blocks + `-generate-config-out` (Terraform 1.5+) and `moved` blocks. q10 explanation got the same nuance.
- **Fix:** the BSL was said to "restrict commercial use" → it restricts competing products only. ⚠ OpenTofu is now in the CNCF; ⚠ IBM acquired HashiCorp in 2025.
- **Fix:** Packer used the legacy `{{timestamp}}` → now `formatdate()`. The nginx path is correct for AL2023.
- **Fix:** the security group allowed 0.0.0.0/0 to private instances → now allows only the ALB SG.
- **Fix:** "the IaC term comes from Kief Morris's book" → the term predates it. Ansible is procedural, not "imperative". HCP Terraform described as a free tier (not "open-source tier"). Atlantis locking explained accurately.
- **Fix:** the pets/cattle state diagram was malformed; rewritten.
- **Add:** a Terraform/OpenTofu takeaway.

### serverless-computing
- **Fix:** the idempotency guard didn't work. `orderId = randomUUID()` means a retry never collides, so the conditional write could never fire.
  - The ID now comes from a client `Idempotency-Key`.
  - The dual-write (outbox) risk is flagged, and the HTTP API JWT claims path is fixed.
  - Tested: 201 → 409 on retry → 400.
- **Fix:** `/tmp` was given as both 512 MB and 10 GB → 512 MB by default, configurable to 10 GB.
- **Fix:** instance specs and prices: t3.micro is 2 vCPU, ~$7.60/month; t3.large is 2 vCPU each; compute cost is now stated as ~$720.
- **Fix:** break-even claim "3–5M requests/month" → computed. About 40M requests/month to match a $60 instance.
- **Fix:** SnapStart now covers Python and .NET too. ⚠ INIT phase billed since Aug 2025. Powertools idempotency languages updated. Runtime → nodejs22.x.
- **Fix:** EmailQueue had no visibility timeout or DLQ; added both. Concurrency-quota nuance added.
- **Add:** a section on serverless containers (Cloud Run concurrency), edge isolates and durable workflows, plus a takeaway.

## Phase 19

### ci-cd-pipelines
- **Fix:** the deploy job was broken. `SSH_PRIVATE_KEY` was set but never used, and `StrictHostKeyChecking=no` disabled host checks. The job now writes the key, pins known_hosts, and deploys by `IMAGE_TAG`.
- **Fix:** a GHCR push needs `packages: write`. Least-privilege `permissions:` added.
- **Fix:** `cache: 'npm'` was said to cache node_modules → it caches `~/.npm`.
- **Fix:** the matrix example had `needs: ci`, but no `ci` job exists in that snippet → `test-matrix`. Node 18 is EOL → now 22/24.
- **Fix:** action versions bumped (⚠ checkout/setup-node v5, build-push v6).
- **Fix:** the default GITHUB_TOKEN wording is now accurate. The "secrets never appear in logs" claim is softened. Parallel jobs still bill minutes. History: Jenkins fork 2011; GitHub Actions CI/CD GA in 2019.
- **Add:** the tj-actions compromise (⚠ March 2025) as the reason to pin actions by SHA. A `pull_request_target` warning. Sigstore/SLSA/SBOM. A DORA metrics callout, plus a takeaway.

### deployment-strategies
- **Fix:** the canary YAML didn't work as written:
  - Three Deployments with overlapping selectors sat in one file, so the Service matched 18 pods.
  - Each Deployment now has a separate `track` selector, and the file is clearly a second, standalone example.
- **Fix:** blue-green by DNS is not atomic (TTL caching).
- **Fix:** "round-robin" again; and "expand-contract = branch by abstraction" was wrong, now removed.
- **Fix:** `pg_repack` is not an online schema-change tool → replaced with gh-ost, `CONCURRENTLY`, `NOT VALID`, and `lock_timeout`.
- **Fix:** the history credited Netflix chaos engineering with popularising canaries → it was automated canary analysis (Kayenta).
- **Add:** a Gateway API weighted HTTPRoute canary, and a note that the ingress-nginx annotation approach is retired. Recreate and shadow-traffic strategies.
- **Tested:** the flag-bucketing code gives a 10.2% rollout share at 10%.

### monitoring-and-metrics
- **Fix:** "counters are integers" → they are floats. Added the `+Inf` bucket, interpolation caveats and native histograms. Summaries give streaming estimates, not "exact" quantiles.
- **Fix:** the rate window should be ≥4× the scrape interval (was 2×). Prometheus's built-in default scrape interval is 1 minute. Timestamps in the exposition format are optional. Kubernetes service-discovery annotations are only a relabel convention (ServiceMonitor is the operator way).
- **Fix:** "the WAL is in memory" → the head block is in memory and the WAL is on disk. Thanos uses a sidecar to upload blocks; Mimir/Cortex use `remote_write`.
- **Fix:** the sequence diagram had Alertmanager notifying Grafana → it now notifies PagerDuty/Slack.
- **Fix:** the rules file lives under `rule_files:`, and `/-/reload` needs `--web.enable-lifecycle`. Memory saturation now uses PSI, not swap.
- **Fix:** the average-vs-p99 example had p99 = 20 ms by nearest rank → numbers changed so it holds.
- **Fix:** USE attribution: Brendan Gregg, 2012, at Joyent.
- **Add:** Pushgateway, OTLP → Collector, and Prometheus 3 OTLP ingestion, plus a takeaway.
- **Tested:** prom-client produces low-cardinality `route` labels.

### logging-and-distributed-tracing
- **Fix:** the OTel code no longer matched the current SDK. Moved to `resourceFromAttributes`, `ATTR_*`, `traceExporter`, `ParentBasedSampler`, and `--import` for ESM. Run against the installed SDK (sdk-node 0.300, sdk-trace 3.0); trace propagation verified.
- **Fix:** Lambda advice contradicted itself (SimpleSpanProcessor vs forceFlush) → now use the layer/extension plus a force-flush.
- **Fix:** "traces avoid clock skew via relative offsets" → spans use wall-clock times, so skew affects traces too.
- **Fix:** the trace diagram labelled inventory "(parallel)" while it ran sequentially; q4 now states parallelism explicitly. "73% of request time" → about 40%.
- **Fix:** the pino example:
  - The error body read `req.headers['x-correlation-id']`, which is undefined when the ID was generated.
  - traceparent was described as preferred but checked second.
  - It now uses `req.correlationId` and validates the header.
- **Fix:** OpenTracing was attributed to Uber → it was a CNCF project led by LightStep/Uber. Sequence-diagram quoting and `\n` fixed.
- **Add:** exemplars, and the 2023 logs data model.

### sre-and-reliability
- **Fix:** the burn-rate math was wrong. "14.4× ⇒ budget gone in 2 hours" → the budget is gone in about 2 days; one hour at 14.4× uses 2%. Fixed in the text, both code samples, tip, takeaway and q8 (which marked the wrong answer as correct). The Workbook ticket tier is 1× over 3 days, not 3×.
- **Fix:** the JS had real float bugs. `0.0144/0.001 = 14.399…` printed "Within budget" for a 14.4× burn, and the 6× threshold missed too. Both now rounded and verified.
- **Fix:** 43.8 vs 43.2 min mixed; now 43.2 everywhere. The airline buffer said 0.4 pp → 0.5 pp.
- **Fix:** "increase timeouts to mitigate cascades" was replaced with flag-off and load shedding. History attribution corrected.
- **Fix:** q1 and q4 explanations referenced option letters; rewritten.
- **Add:** a Prometheus multi-window burn-rate rule file. A section on the nines table, serial dependency math, and request- vs time-based budgets. Plus a takeaway.

## Phase 20

### machine-learning-basics
- **Fix:** the regression example used a biased `sort(() => Math.random()-0.5)` shuffle and had non-reproducible claimed output → seeded Fisher–Yates, with the actual output.
- **Fix:** the tip had a garbled bullet ("number of values with the maximum value"). The learning-rate advice was wrong in both directions.
- **Fix:** a full-depth tree "no better than random" → noticeably worse. Universal approximation needs only one hidden layer. Epoch/step definitions corrected. Removed the GPT-4 mention.
- **Add:** the L1/L2 formula and λ tuning. Gradient-boosted trees (the tabular default). PR-AUC for heavy imbalance. Plus a takeaway.
- **Verified:** kNN and the metrics example outputs.

### neural-networks-intro
- **Fix:** the XOR backprop bug: `dA1` used the **already-updated** W2. It is now computed first, with a seeded init.
- **Fix:** the MNIST parameter count was 234,634 → 235,146. "GPT-4 has 96 layers" → GPT-3. BCE example comment → 0.1643.
- **Fix:** dropout "scale weights at inference" → inverted dropout (fixed in q8 too). "Thousands of epochs" is wrong for large data. q9 "0^10" → 0.25^10.
- **Add:** residual connections and Xavier/He initialisation. AdamW. LayerNorm/RMSNorm. SwiGLU. Plus a takeaway.

### how-llms-work
- **Fix:** the attention example's numbers were all wrong: weights 0.576/0.212 → 0.503/0.248; output [6.48, 2.12] → [6.28, 3.72]; and the √dk demo didn't show saturation. **Add:** a causal-mask loop.
- **Fix:** temperature percentages were wrong. Top-p 0.9 gives {Paris, London}, not three tokens.
- **Fix:** parameter estimate "~8B" → 7.49B, with an explanation of the gap to 8.03B. GPT-2 now uses tied embeddings (≈124M).
- **Fix:** Chinchilla: "1,875× the ratio" → about 1,900 tokens per parameter, which is about 94× the ratio. q9 explanation was garbled.
- **Fix:** GPT-4o vocabulary is not 100k (that's cl100k). Removed the GPT-4 rumoured layer/head/parameter figures and dated context-window and cutoff lists. Generic model limits now go in the code.
- **Fix:** RoPE "naturally extrapolates" → it needs scaling tricks (PI/NTK/YaRN). GQA is "groups", not a single KV head. FlashAttention is about HBM vs SRAM.
- **Fix:** post-norm `LayerNorm(x+f(x))` → pre-norm with RMSNorm. FFN 4× → SwiGLU. Causal mask applies at prefill as well. Temperature-0 non-determinism comes from float/batching, not dropout. The hallucination and uncertainty claims are softened to accurate.
- **Add:** a section on reasoning models / test-time compute, MoE total vs active parameters, and tool-use agents. RLHF/DPO/RLAIF/verifiable-reward RL. KV-cache memory formula (128 KiB/token, 16 GiB at 128K for Llama 3 8B). Speculative decoding. The 6·N·D training FLOPs rule. Updated history. Plus takeaways.

### ml-systems-in-production
- **Fix:** the PSI demo printed 17.08 (comment said "0.38x"); the distributions barely overlapped and the 1e-9 floor blew it up. It now uses decile bins from training data, a 1e-4 floor, and normal samples (0.006 vs 0.595).
- **Fix:** the output-drift demo printed "OK" while the comment claimed an alert → it now monitors the flagged-rate (17× → ALERT).
- **Fix:** "model cards = slice monitoring" → model cards are documentation (Mitchell 2019). The technical-debt paper title/year was mixed up (2014 vs NeurIPS 2015).
- **Fix:** q10 claimed Airflow has watermarks → Flink, Beam and Spark do. ⚠ TorchServe is in limited maintenance. Serving now mentions continuous batching, SGLang and TensorRT-LLM. The serving timestamp is deterministic.
- **Add:** an "LLM systems in production" section (eval sets / LLM-as-judge, prompt and model versioning, cost/latency monitoring, prompt-injection guardrails). Versioning feature constants. Plus a takeaway.

---

## Facts I'm less sure of (please spot-check)
1. **ingress-nginx retirement (March 2026).** Announced Nov 2025.
2. **gp3 limits raised in 2025.** Phrased generically; no exact numbers stated.
3. **OpenTofu joining the CNCF.** IBM's HashiCorp acquisition completed in 2025.
4. **Lambda INIT-phase billing since August 2025.**
5. **TorchServe limited maintenance.**
6. **Action versions.** `actions/checkout@v5`, `setup-node@v5`, `docker/build-push-action@v6`.
7. **tj-actions/changed-files compromise date (March 2025).**
8. **OpenTelemetry JS package names.** They are changing (`sdk-trace-base` is deprecated in favour of `sdk-trace`). The example was verified against the locally installed latest versions, and the text notes that names drift.
