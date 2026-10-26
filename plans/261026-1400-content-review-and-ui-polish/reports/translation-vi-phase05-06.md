# Vietnamese translation — phase05-06

All 10 overlays validate with 0 errors (`node scripts/validate-translations.mjs vi <slug>`). The remaining warnings only say `curriculum-titles` is out of sync, which the lead fixes with sync-translated-titles.

## phase5
- concurrency-deadlocks — title "Concurrency & Deadlock". Kept Coffman condition names in English (Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait). Glossed once: critical section (vùng găng), Banker's Algorithm (thuật toán chủ ngân hàng), starvation (chết đói), priority inversion (đảo ngược độ ưu tiên).
- cpu-scheduling — title kept "CPU Scheduling". Metric names (turnaround, waiting, response time, throughput) kept in English, with the definitions translated. "nice"/weight explained as trọng số once.
- file-systems — title "File System". Kept page cache, write-back, journaling, copy-on-write, extent, inode, dentry in English. "durability" kept in English; "bền vững" used for durable/persist.
- processes-threads — title "Process & Thread". Fenced code block is unchanged byte for byte. "park" (goroutine) rendered as "đỗ" in quotes.
- system-calls-and-interrupts — title "System Call, Interrupt & I/O". Kept top half/bottom half, softirq, readiness/completion in English. "batch" rendered as "gom lô".
- virtual-memory — title "Bộ nhớ ảo (Virtual Memory)". The label "Concept" became "Khái niệm". Rendered locality as "tính cục bộ (locality)" and eviction as "đẩy ra".

## phase6
- http-dns — title kept "HTTP, HTTPS & DNS". Both fenced WebSocket handshake blocks are unchanged. Quiz options that are headers or record types stay in English. Rendered "load-bearing" as "gánh trọng trách" (I wasn't sure about this one).
- ip-routing — title "Địa chỉ IP & routing". Kept on-link, default gateway, longest prefix matching, administrative distance in English. Rendered "blackholing YouTube" as "nuốt mất YouTube".
- osi-tcp-ip — title "Mô hình OSI & TCP/IP". Kept layer names (Physical…Application) in English. Rendered opaque payload as "payload mờ (opaque)".
- tcp-udp — title kept "TCP vs UDP". Rendered "ossification" as "hóa xơ cứng" in parentheses. "fire-and-forget" became "bắn rồi quên".
