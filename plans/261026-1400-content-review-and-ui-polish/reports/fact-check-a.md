# Fact-check A: claims written from memory (checked 2026-10-26)

Verdicts: **correct** (left as is, sometimes with added precision), **fixed** (was wrong or out of date), **softened** (could not be pinned down, so the text now hedges).
Validators: `validate-content.mjs` gives 146 topics, 0 errors. `validate-mermaid-diagrams.mjs` gives 758 diagrams, 0 failed.

## 1. GC: Go Green Tea, ZGC, Shenandoah, G1 (phase2/garbage-collection.json)
- **Correct.** Go 1.26 (Feb 2026) turned Green Tea on by default. JDK 24 removed non-generational ZGC (JEP 490). JDK 25 made generational Shenandoah a product feature (JEP 521). G1 has been the default since JDK 9.
- Added precision: the release notes expect 10–40% less GC overhead, and the `GOEXPERIMENT=nogreenteagc` opt-out is due to be removed in Go 1.27.
- Sources: https://go.dev/doc/go1.26 · https://openjdk.org/jeps/490 · https://openjdk.org/jeps/521

## 2. Bloom filters: Medium and Safe Browsing (phase3/bloom-filters.json)
- **Fixed (made more precise).** Medium did describe this use in 2015. But in Aug 2025 Medium Engineering reported that it removed its Bloom filters entirely, replacing them with per-user DB queries that cost about one tenth as much. The text now says both.
- Safe Browsing description (Bloom filter first, then prefix set and hash-prefix lists): **correct**.
- Sources: https://medium.com/the-story/what-are-bloom-filters-1ec2a50c68ff · https://medium.engineering/engineering-stories-behind-the-medium-daily-digest-algorithm-part-2-c977ad0b134f · https://codereview.chromium.org/6286072

## 3. V8 array growth and Node stack depth (phase3/arrays-linked-lists, phase2/recursion, phase2/memory-stack-heap)
- V8 growth "≈1.5× + 16": **correct**. V8 main has `NewElementsCapacity = old + (old >> 1) + 16` in `src/objects/js-objects.h`.
- Stack depth: **softened and fixed** in recursion.json (prose, takeaway, quiz q10 explanation). "About 1 MB" is now "a little under 1 MB; the `--stack-size` default depends on build and architecture" (V8 globals.h has 984/960/864 KB variants). I measured 9,156 trivial frames and about 4,578 six-parameter frames on Node 22/23 on arm64 Mac. The old "~4,000" became "roughly half". Every count is now framed as an order of magnitude.
- memory-stack-heap.json: no specific claim, left unchanged.
- Source: https://chromium.googlesource.com/v8/v8/+/refs/heads/main/src/objects/js-objects.h · .../src/common/globals.h

## 4. Character encoding (phase1/week3-data-representation-character-encoding.json)
- PEP 686 is Final, and Python 3.15.0 **was released Oct 9, 2026** with UTF-8 mode on by default. **Fixed** the wording from future tense to "3.15 (released October 2026) turned on…". It still advises `encoding='utf-8'` for code that must run on older Pythons.
- Unicode: **fixed, out of date.** The text said Unicode 17.0 (Sep 9, 2025; 159,801 chars) was current. Unicode 18.0 shipped Sep 2026 (~172,8xx chars; trade press says 172,808). Prose and the Mermaid label now say "~173,000".
- Sources: https://peps.python.org/pep-0686/ · https://www.python.org/downloads/release/python-3150/ · https://www.unicode.org/versions/Unicode17.0.0/ · https://linuxiac.com/unicode-18-0-released-with-13007-new-characters/

## 5. DORA metrics (phase10/testing-cicd.json, phase10/agile-and-process.json)
- **Fixed.** The rename to "failed deployment recovery time" happened in **2023**, not as a loose "now often called". Rework rate ("deployment rework rate") was added in 2024, with the regrouping into throughput (lead time, deploy frequency, recovery time) and instability (change fail rate, rework rate). Availability was added in 2019 and broadened to reliability in 2021.
- agile-and-process prose and takeaway now include rework rate. testing-cicd prose and takeaway rewritten.
- Sources: https://dora.dev/guides/dora-metrics/ · https://dora.dev/insights/dora-metrics-history/

## 6. Git hashing (phase10/git-internals.json)
- **Correct.** SHA-1DC has been the default since 2.13. SHA-256 was experimental in 2.29 and lost the "experimental" label in 2.42 (Aug 2023). BreakingChanges lists the SHA-256 default for Git 3.0, with "no planned release date".
- Added: "Git 3.0 had not shipped as of Git 2.56 (2026-09-28)".
- Sources: https://github.com/git/git/blob/master/Documentation/BreakingChanges.adoc · https://git-scm.com/ · https://devclass.com/2023/08/22/git-2-42-released-sha-256-repositories-no-longer-an-experimental-curiosity/

## 7. Pramp to Exponent (phase21/mock-interview-strategy.json)
- **Correct.** "Pramp is joining Exponent". Exponent took over Pramp (reported Nov 2021), and new Pramp sessions have run on Exponent since 2024. No change. Only secondary sources found for the exact date, and the text doesn't state one.
- Sources: https://www.tryexponent.com/blog (post "Pramp is Joining Exponent") · https://app.dealroom.co/companies/pramp

## 8. GitHub Actions majors and Node versions (phase10, phase18, phase19)
- Current majors from `gh api repos/<action>/releases` on 2026-10-26: checkout **v7** (7.0.1), setup-node **v7**, cache **v6**, upload-artifact **v7**, codecov-action **v7**, docker/build-push-action **v7**, docker/login-action **v4**. Release notes show no input changes that would break the examples.
- **Fixed** every `uses:` in agile-and-process.json and ci-cd-pipelines.json. Also fixed prose `@v5` → `@v7` and the SHA-pin comment `# v5.0.0` → `# v7.0.1`. testing-cicd.json had no `uses:` lines.
- Node: `node:22-alpine` → `node:24-alpine` (docker-and-containers code and 2 diagrams). ci-cd-pipelines `node-version: '22'` / "Set up Node.js 22" → 24. Matrix and quiz q9 → `[22, 24, 26]`. Lambda `nodejs22.x` → `nodejs24.x` (serverless code and serverless.yml). Lambda runtime lists → Node.js 24 / Python 3.14 / Java 25 / .NET 10.
- **Caveat:** by the official schedule, Node 24 moved to *Maintenance* LTS on 2026-10-20, and Node 26 becomes Active LTS on **2026-10-28**. Calling Node 24 "Active LTS" today is technically wrong. Comments in the files just say "LTS line". Bump to 26 later if wanted.
- Sources: https://github.com/actions/checkout/releases (and the other repos' release pages) · https://github.com/nodejs/Release/blob/main/schedule.json · https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtimes.html

## 9. tj-actions/changed-files (phase19/ci-cd-pipelines.json; no other occurrence outside phase5/6/15)
- **Fixed (made more precise).** The attack is CVE-2025-30066. Tags were re-pointed on Mar 14–15, 2025 to a malicious commit that printed secrets into workflow logs. About 23,000 repos *used* the action; that is not the number that leaked. Old text said "dumped secrets… across thousands of repositories". New text names the CVE, gives the ~23k usage figure, and notes that leaked logs were public on public repos.
- Also fixed "GitHub can update what `v4` points to": whoever controls the action's repo moves the tag, not GitHub.
- Source: https://www.cisa.gov/news-events/alerts/2025/03/18/supply-chain-compromise-third-party-github-action-cve-2025-30066

## 10. phase18 cloud claims
- ingress-nginx: **correct.** Announced Nov 11, 2025. Best-effort maintenance ended March 2026; the last release was controller-v1.15.1 (2026-03-19) and the repo is now archived. kubernetes-orchestration now mentions the announcement and the archived repo. https://kubernetes.io/blog/2025/11/11/ingress-nginx-retirement/
- gp3: **fixed, was vague.** Sep 26, 2025: limits raised to 80,000 IOPS, 2,000 MiB/s, 64 TiB (from 16k / 1,000 / 16 TiB). https://aws.amazon.com/about-aws/whats-new/2025/09/amazon-ebs-size-provisioned-performance-gp3-volumes
- OpenTofu in CNCF: **correct.** Accepted as a Sandbox project on Apr 23, 2025. https://www.cncf.io/projects/opentofu/
- Lambda INIT billing: **correct.** Effective Aug 1, 2025, it applies to on-demand managed-runtime ZIP functions; other configurations already billed INIT. cloud-computing-fundamentals now says exactly that. https://aws.amazon.com/blogs/compute/aws-lambda-standardizes-billing-for-init-phase/
- Gateway API GA in v1.0 (Oct 2023): **correct**, unchanged.

## 11. TorchServe (phase20/ml-systems-in-production.json)
- **Fixed (made stronger).** The README says "Limited Maintenance… no planned updates, bug fixes, new features, or security patches", and the GitHub repo is now **archived**. The text now says it is no longer maintained, and vLLM was added to the alternatives. https://github.com/pytorch/serve

## 12. Load balancing (phase8/load-balancing.json)
- ingress-nginx retirement: **correct** (see 10).
- Istio ambient GA in 1.24 (Nov 7, 2024): **correct**. https://istio.io/latest/news/releases/1.24.x/announcing-1.24/
- ALB health-check defaults (30 s interval, healthy 5, unhealthy 2): **correct** for instance/IP targets. Added the 5 s timeout and the "instance and IP targets" qualifier. https://docs.aws.amazon.com/elasticloadbalancing/latest/application/target-group-health-checks.html
- Deregistration delay 300 s: **correct**. https://docs.aws.amazon.com/elasticloadbalancing/latest/APIReference/API_TargetGroupAttribute.html
- Cross-zone: **correct, made more precise.** For ALB it is always on at the LB level but can be turned off per target group. For NLB it is off by default. https://docs.aws.amazon.com/elasticloadbalancing/latest/userguide/how-elastic-load-balancing-works.html

## Files changed
phase1/week3-data-representation-character-encoding, phase2/garbage-collection, phase2/recursion, phase3/bloom-filters, phase8/load-balancing, phase10/agile-and-process, phase10/git-internals, phase10/testing-cicd, phase18/cloud-computing-fundamentals, phase18/compute-storage-networking, phase18/docker-and-containers, phase18/kubernetes-orchestration, phase18/serverless-computing, phase19/ci-cd-pipelines, phase20/ml-systems-in-production.
Unchanged after checking: phase3/arrays-linked-lists, phase2/memory-stack-heap, phase21/mock-interview-strategy.
