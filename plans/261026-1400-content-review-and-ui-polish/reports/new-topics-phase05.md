# New Topics — Phase 5 (Operating Systems), week 19

Three new book-chapter topics created; `curriculum.json` untouched (entries already existed).
Validation: `node scripts/validate-content.mjs system-calls cpu-scheduling file-systems` → 3 topics, 0 errors, 0 warnings
(full run: 146 topics, 0 errors). Every Mermaid diagram was additionally parsed with the repo's mermaid@11.16 (`mermaid.parse`) — all pass.

| File | Sections | Diagrams | Code | Quiz answer positions |
|---|---|---|---|---|
| `src/content/phase5/system-calls-and-interrupts.json` | 24 | 4 | 4 (js, bash, python, js) | 1,2,0,3,1,0,2,3,1,2 |
| `src/content/phase5/cpu-scheduling.json` | 24 | 4 | 4 (python, python, bash, js) | 2,0,3,1,0,2,3,1,2,3 |
| `src/content/phase5/file-systems.json` | 23 | 4 | 4 (bash, python, bash, js) | 1,2,0,3,0,2,3,1,2,0 |

## How code was verified
- JS/Python examples run on macOS (Node 23, Python 3.14) **and** on Linux in Docker (`node:22-alpine`, `python:3.13-alpine`, kernel 5.10). Outputs quoted in the explanations come from those runs.
- Bash examples (strace, scheduler commands, links/inodes, page-cache dirty pages) were run in Linux containers. The output shown is real but abridged.
- Scheduling math: a Python simulator (it is the topic's first code example) produced every Gantt timeline and average. I also re-checked RR, SRTF, priority and quiz q1 by hand. FCFS 8.75 / SJF 7.75 / SRTF 6.50 / RR(q=4) 11.75 avg wait; priority example avg 8.2.
- Nice weights checked by experiment: nice 0 vs nice 5 pinned to one core gave a 3.04 ratio (kernel 1024/335 = 3.06).

## system-calls-and-interrupts — what it covers
- Rings/ELs and the three ways into the kernel. Full x86-64 `syscall` path: rax and argument registers, rcx/r11, LSTAR, `entry_SYSCALL_64`, KPTI, `pt_regs`, `copy_from_user`, `-errno` → errno. ARM64 `svc`. Linux ABI stability vs macOS private syscalls.
- Syscall cost (direct, mitigations, FlexSC indirect costs). vDSO, including `getrandom` in the vDSO since 6.11. A measured 1-byte vs batched write demo.
- Common syscalls table. openat, clone flags for threads, futex, libc wrappers. Real strace output and `strace -c` (about 1,400 syscalls just to start Node and read a file).
- Interrupts vs exceptions (fault/trap/abort) vs syscalls, plus a taxonomy diagram. APIC/MSI-X/IPIs. Top and bottom halves (softirq, threaded IRQs, workqueues, BH workqueues replacing tasklets), NAPI, coalescing.
- DMA, IOMMU, zero-copy, polling vs interrupts (IOPOLL, busy poll, DPDK/SPDK), plus a sequence diagram.
- Blocking vs non-blocking, readiness vs completion, the regular-file "always ready" trap. select/poll/epoll/kqueue table, LT vs ET, EPOLLEXCLUSIVE. A Python selectors demo.
- io_uring (SQ/CQ rings, SQPOLL, ops, PostgreSQL 18 `io_method`, security restrictions), plus a diagram.
- Node/libuv: epoll/kqueue/IOCP, the 4-thread pool and what uses it, *Sync APIs, a pbkdf2 pool demo.

## cpu-scheduling — what it covers
- When the scheduler runs, the dispatcher, context-switch costs, and a state diagram. Metrics table with exact definitions. Cooperative vs preemptive, including event loops and Go 1.14 async preemption.
- Fully worked FCFS/SJF/SRTF/RR on one workload, a priority example, the exponential-average burst prediction. Starvation and aging, nice semantics.
- MLFQ (OSTEP rules, anti-gaming rule, boost), plus a diagram. CFS (vruntime formula, weight table, rbtree, latency/granularity, group scheduling).
- **EEVDF (6.6)**: lag, eligibility, virtual deadline, slices, 6.12 custom slices and delayed dequeue, plus a diagram. sched_ext and PREEMPT_RT in 6.12. Which distros run EEVDF.
- RT classes and hierarchy, FIFO/RR/DEADLINE, RT throttling (950000/1000000 verified), what "real-time" requires.
- Multicore: per-CPU run queues, scheduling domains, wake placement, affinity, NUMA, hybrid cores. **cgroup cpu.max throttling.** Verified that `nproc` ignores quotas (said 4) while Node 22 `os.availableParallelism()` honours them (said 1 with `--cpus=1.5`). JDK 10+ and Go 1.25 GOMAXPROCS are also container-aware.
- Priority inversion and Mars Pathfinder, plus a sequence diagram. Inheritance vs ceiling. App guidance: pool sizing, the W/C formula, hidden pools. A measured oversubscription demo: mean completion about 1.9 s → 3.6 s.

## file-systems — what it covers
- Inode contents, dirents, htree, path resolution (with diagram), dentry cache, inode exhaustion, ctime ≠ creation.
- Hard vs symbolic links (rules, fast symlinks, dir link count, pnpm/rsync uses, deleted-but-open + `lsof +L1`) with a verified demo.
- fd table → open file description → inode (with diagram), dup/fork offset sharing (verified Python demo), O_APPEND, EMFILE, O_CLOEXEC.
- Allocation table (contiguous/linked-FAT/indexed/extents), ext2 pointer math (~4 TiB), ext4 extents (128 MiB, 8 extents per GiB), delayed allocation, free-space (bitmaps/block groups, XFS B+trees, ZFS space maps).
- Page cache, readahead, write-back sysctls (values verified in the VM), O_DIRECT. A dirty-pages demo (`dd` with and without `conv=fsync`).
- fsync/fdatasync/O_DSYNC, directory fsync, the atomic-replace pattern (verified Node implementation), ext4 2009 zero-length files / `auto_da_alloc`, PostgreSQL fsyncgate 2018, macOS `F_FULLFSYNC`.
- Journaling steps and ext4 `data=journal|ordered|writeback` (with sequence diagram). COW (ZFS/Btrfs/APFS/ReFS, snapshots, reflinks, checksums, costs, `chattr +C`) with diagram. Log-structured (Sprite LFS, F2FS, LSM link).
- VFS objects, mounting and options, namespaces/bind/overlayfs. Permissions incl. directory bit semantics, special bits, umask, ACLs, LSMs. SSD FTL, GC, write amplification, TRIM/fstrim/discard, alignment, volatile caches, ZNS.

## Unsure / worth a second look
- **libuv io_uring status**: I wrote that libuv 1.45 (2023) added io_uring for fs ops, that Node turned it off by default after an early-2024 security fix, and that `UV_USE_IO_URING=1` opts in. I'm confident of the substance; the exact release versions are from memory.
- **Docker default seccomp blocks io_uring**: I believe this has been true since about Docker 25 (2023). It is phrased generally ("container runtimes' default seccomp profiles (Docker's among them)").
- **EEVDF details**: I'm not fully sure of two points: that custom slices via `sched_setattr` `sched_runtime` arrived in 6.12, and that the base slice is 0.75 ms scaled to about 3 ms on 8+ CPUs (log scaling). The "fair server" replacing RT throttling is described without naming a version.
- **Btrfs `discard=async` default on SSDs** (since about 6.2) is from memory.
- Syscall cost figures (50–100 ns bare, a few hundred with mitigations) and the KPTI 5–30% slowdown are typical published ranges, not my own measurements. The measured Node numbers (about 2.5–3 µs per `writeSync`) include binding overhead, and the text says so.
- `processes-threads.json` (owned by another agent) still describes CFS as Linux's current scheduler. The new cpu-scheduling topic says EEVDF replaced it in 6.6, so the owner of that file may want to align it.
