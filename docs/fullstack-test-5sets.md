# Fullstack Developer Test — 5 Sets

## Mục lục
- [Set 1](#set-1)
- [Set 2](#set-2)
- [Set 3](#set-3)
- [Set 4](#set-4)
- [Set 5](#set-5)
- [Đáp án](#đáp-án)
- [Rubric chấm](#rubric-chấm)

---

## Set 1

### MCQ (15 câu)

**1.** [debug] Một Node.js API server đột nhiên response chậm hơn 10x sau 3 ngày uptime. CPU thấp, memory tăng dần. `heapdump` snapshot cho thấy hàng triệu object `Socket` không được GC. Điều gì đang xảy ra?

A. Event loop bị block bởi `process.nextTick` recursion
B. Memory leak do không unbind event listener từ `EventEmitter`
C. `libuv` thread pool bị cạn do slow I/O
D. `V8` không kịp compact heap vì `--max-old-space-size` quá thấp

**2.** [debug] Payment service nhận request từ client với idempotency key. Request đầu gọi Payment Gateway, gateway xử lý thành công nhưng response bị timeout. Client retry với cùng idempotency key, gateway xử lý lại. Kết quả: user bị charge 2 lần. Gateway không check idempotency key. Fix ít tệ nhất?

A. Client chỉ retry khi nhận được response rõ ràng (non-timeout) — nếu timeout thì không retry
B. Server gọi gateway với flag idempotent=true — gateway tự dedup
C. Dùng transactional outbox — ghi event vào DB trước, worker gọi gateway, duplicate bị reject ở DB
D. Gateway phải reject retry nếu idempotency key đã tồn tại — idempotency là responsibility của gateway, không phải client

**3.** [situation] PostgreSQL query chạy nhanh trên staging (1s) nhưng production chậm (45s). `EXPLAIN ANALYZE` cho thấy index bị ignore — planner chọn seq scan vì `estimated rows` sai lệch 100x so với actual. Bước đầu tiên bạn làm gì?

A. `SET enable_seqscan = off`
B. Thêm `pg_hint_plan` để force index
C. `ANALYZE` để cập nhật statistics
D. Rewrite query với CTE

**4.** [trade-off] Team 3 devs, budget $500/tháng cho infra, cần deploy 1 REST API + 1 cron job (chạy mỗi giờ). Chọn ít tệ nhất?

A. Kubernetes cluster trên 3 nodes — auto scaling, zero-downtime deploy
B. AWS Lambda cho API + CloudWatch Events cho cron — không lo server
C. Docker Compose trên 1 VPS — đơn giản, cron dùng systemd timer
D. App Runner (fully managed) + managed cron — không cần DevOps

**5.** [debug] WebSocket server đột nhiên ngắt kết nối hàng loạt (500 clients drop đồng thời). Client reconnect ngay lập tức → tạo thêm 500 connection mới → server quá tải → tiếp tục drop. Tên hiện tượng?

A. Thundering herd
B. C10k problem
C. Reconnection storm (dogpile effect)
D. Connection leak

**6.** [trade-off] Startup 2 tháng tuổi, 2 devs, cần launch e-commerce MVP trong 2 tuần. SEO quan trọng nhưng không muốn hydrate lại toàn bộ component. Chọn ít tệ nhất?

A. Next.js hybrid SSR/SSG — page quan trọng SSR, phần còn lại client-side render
B. Next.js SSR toàn bộ — SEO tốt, ignore performance issues
C. Next.js SSG + ISR — build toàn bộ page, stale-while-revalidate
D. Pure SPA + prerender.io — SEO qua service, dev nhanh nhất

**7.** [situation] Bạn đang code feature trên branch `feat/payment`. Cần gấp hotfix `main` nhưng `feat/payment` có 10 commits chưa merge, trong đó có 2 commits sửa cùng file với hotfix. Cách ít tệ nhất?

A. Merge `feat/payment` vào `main` rồi revert 8 commits không liên quan
B. Cherry-pick hotfix commits từ `feat/payment` sang `main`
C. Git stash toàn bộ, checkout main, làm hotfix, commit, quay lại và unstash
D. Git rebase `feat/payment` lên main mới nhất, resolve conflict, tạo hotfix branch từ đó

**8.** [debug] API endpoint trả về list orders của user — production response time 800ms. Dev môi trường 50ms. `pg_stat_statements` cho thấy 100 identical queries, mỗi query 1ms, tổng 100ms cho DB. Response time 800ms. Part nào chiếm nhiều thời gian nhất?

A. Network latency giữa app và DB — 100 round trips, mỗi trip latency 5ms
B. Ứng dụng (serialization, N+1 loop overhead) — 100 queries tuy nhanh nhưng loop + JSON stringify 100 lần cộng dồn
C. Connection pool exhaustion gây queue — request chờ connection 300ms
D. JSON serialization `JSON.stringify` single bottleneck — 100ms cho DB nhưng 700ms còn lại không giải thích được

**9.** [trade-off] Team 5 devs, maintain 3 services nhỏ (auth, payment, notification). Dùng monorepo sẽ gây chậm CI (10 phút). Chọn ít tệ nhất?

A. Multi-repo — mỗi service 1 repo riêng, CI nhanh, dev độc lập
B. Monorepo + CI chỉ chạy test trên changed files — giảm 90% thời gian
C. Multi-repo + workspace script đồng bộ version — giữ consistency
D. Monorepo với `turbo`/`nx` — cache task, chỉ build service thay đổi

**10.** [debug] API request bị treo 30s rồi timeout. Load balancer log: upstream connect error. Backend server log: request chưa bao giờ đến. `netstat` trên backend: không có connection từ load balancer. Vấn đề gì?

A. Load balancer health check fail → remove backend khỏi pool → retry timeout
B. SSL handshake giữa LB và backend bị stall
C. Backend `keepalive_timeout` quá thấp → connection bị đóng
D. DNS TTL cache sai → LB gửi request sai IP

**11.** [situation] API server có 10GB RAM, xử lý 500 request/s. Mỗi request dùng 50MB peak. `pgBouncer` pool size = 50. Thỉnh thoảng có request chờ 5s. Cần tuning pool?

A. Pool size 50 là quá lớn → giảm còn 20 → giảm contention
B. Pool size 50 là vừa — RAM đủ cho 200 concurrent — vấn đề ở DB side
C. Chuyển sang `pgBouncer` transaction mode thay vì session mode
D. Tăng pool lên 100 → xử lý được nhiều request hơn

**12.** [situation] Production deploy version mới. 2 phút sau, error rate 5xx tăng từ 0.1% lên 8%. Feature mới ảnh hưởng payment flow. Team có 2 lựa chọn: (A) rollback mất 2 phút, (B) hotfix mất 15 phút. Error rate đang tăng dần. Team không có feature flag system. Chọn ít tệ nhất?

A. Rollback ngay — restore version cũ trong 2 phút, investigate sau, downtime ngắn hơn
B. Deploy hotfix — fix nguyên nhân, user chịu lỗi thêm 15 phút nhưng fix được gốc
C. Giữ nguyên version — 8% error rate: nếu payment fail thì user sẽ retry, không mất doanh thu
D. Scale up thêm instances — error do overload, thêm server giải quyết

**13.** [trade-off] Startup 3 devs, cần xây API public cho mobile app. REST quen thuộc, GraphQL linh hoạt. Chọn ít tệ nhất?

A. REST — đơn giản, ai cũng biết, caching dễ
B. REST + sparse fieldset (`?fields=id,name`) — compromise
C. GraphQL — client tự chọn field, giảm over-fetching
D. GraphQL + codegen cho type safety

**14.** [situation] Static assets (JS bundles, images) được deploy lên CDN. Sau khi release version mới, user vẫn nhận file cũ dù đã cache-bust bằng hash trong filename. CDN config TTL = 7 days. Cách fix an toàn?

A. Đổi CDN provider
B. Invalidate CDN cache tự động sau mỗi deploy qua API
C. Thêm version prefix vào CDN path (`/v2/assets/...`) thay vì filename hash
D. Chuyển sang service worker intercept

**15.** [debug] Transaction A giữ lock row X, transaction B muốn update row X, transaction C giữ lock row Y (B đang chờ A, A muốn update row Y và chờ C). PostgreSQL xử lý thế nào?

A. Timeout sau `deadlock_timeout` → rollback transaction có cost thấp nhất
B. Cả 3 đều chờ vô hạn đến khi admin can thiệp
C. Rollback B vì nó gây ra deadlock
D. Rollback C vì nó là transaction gần nhất

---

### Essay 1 — Inventory Reservation (Algorithm/Logic)

**Context:**
Startup e-commerce 3 devs, budget $5k/tháng, cần launch trong 3 tuần. Hàng hot bán flash sale — 1000 user giành 100 sản phẩm. Cần đảm bảo không oversell, không chặn user lâu.

**Yêu cầu:**
Có 3 approach để xử lý inventory reservation:
- **Approach A:** Pessimistic lock — `SELECT ... FOR UPDATE` ngay khi user add to cart
- **Approach B:** Redis atomic decrement — `DECR stock_123`, nếu result >= 0 thì reserve
- **Approach C:** Queue-based — Cart request vào SQS, consumer xử lý tuần tự, DB optimistic lock

**Câu hỏi (trả lời tối đa 500 từ):**
1. Chọn 1 approach bạn sẽ dùng trong production. Tại sao bạn reject 2 approach còn lại?
2. Nếu Redis (ở approach bạn chọn) crash — system recover trong bao lâu? Data inconsistency giữa Redis và PostgreSQL xử lý sao?
3. Với business constraint (team 3 người, 3 tuần, budget hạn chế) — approach bạn chọn có gì bất lợi? Mitigate thế nào?

---

### Essay 2 — Real-time Leaderboard (Database)

**Context:**
Game startup 5 devs, launch trong 1 tháng, server budget $2k/tháng. Game có 10K DAU, leaderboard real-time theo score người chơi. Có thể chấp nhận leaderboard chậm 30s.

**Yêu cầu:**
Có 3 approach:
- **Approach A:** Redis Sorted Set — `ZINCRBY leaderboard 100 user_456`, `ZREVRANGE` để lấy top
- **Approach B:** PostgreSQL materialized view refresh mỗi 30s — query `ORDER BY score DESC LIMIT 100`
- **Approach C:** Kafka → Redis Stream → consumer cập nhật summary table

**Câu hỏi (trả lời tối đa 500 từ):**
1. Chọn 1 approach bạn dùng. Giải thích vì sao reject các approach còn lại.
2. Redis node failure → recovery trong bao lâu? Leaderboard hiển thị score cũ → user complain, xử lý sao?
3. Business constraint (team nhỏ, budget thấp, timeline gấp) ảnh hưởng gì đến decision của bạn?

---


## Set 2

### MCQ (15 câu)

**1.** [debug] Express.js server đột nhiên ngừng response sau 5 phút chạy CPU-bound task (tính toán báo cáo). Các route khác (kể cả health check) đều timeout. Vì sao?

A. Express middleware queue bị overflow
B. Worker thread pool cạn kiệt
C. Event loop bị block vì CPU-bound task chạy trên main thread
D. `maxConnections` trong `http.Server` đạt giới hạn

**2.** [trade-off] Read-heavy app (90% read, 10% write), dataset 50GB, RAM server 8GB. Cần cải thiện read throughput. Chọn ít tệ nhất?

A. Thêm read replica PostgreSQL — app phân biệt read/write connection
B. Thêm Redis cache trước PostgreSQL — cache query result phổ biến
C. Thêm CDN cho API response
D. Index tất cả column được dùng trong WHERE

**3.** [debug] Service A gọi Service B qua HTTP, B gọi C (DB query). C bị slow (5s/query). B có thread pool 20 threads, mỗi thread chờ C. Khi C chậm, B thread pool đầy sau 20 requests. A giữ HTTP connection chờ B → A connection pool cũng đầy. Cách phòng ngừa hiệu quả nhất?

A. Tăng B thread pool lên 100 — chịu được nhiều request chờ hơn
B. Tăng A→B timeout — connection chờ lâu hơn trước khi timeout
C. Cache C result với TTL 30s — giảm tần suất C slow
D. Circuit breaker ở B→C — khi C chậm quá threshold, B fail fast ngay, release thread và connection

**4.** [debug] PostgreSQL query chạy nhanh lúc mới restart (200ms), chậm dần theo thời gian (5s). `EXPLAIN (BUFFERS, ANALYZE)` cho thấy shared hit giảm, disk read tăng. `pg_stat_user_tables` cho thấy `n_dead_tup` ≈ `n_live_tup`. Vấn đề gì?

A. `shared_buffers` quá nhỏ so với working set
B. Index bị bloated do UPDATE/DELETE không vacuum kịp
C. Connection pool sizing sai
D. `work_mem` quá thấp gây disk sort

**5.** [trade-off] Team 5 devs xây nền tảng e-commerce. Cần độc lập deploy từng module. Hiện tại là monolithic Rails app 50K LOC. Chọn ít tệ nhất?

A. Modular monolith — tách thành packages, vẫn 1 deploy, sau này tách dần
B. Microservices — mỗi module 1 service riêng, message queue giao tiếp
C. SOA — extract từng service theo use case, shared database
D. Nanoservices — mỗi function 1 service, AWS Lambda

**6.** [debug] Next.js page dùng `getServerSideProps` gọi API external, response trung bình 2s. Page TTFB (Time To First Byte) = 2.3s. Business yêu cầu TTFB < 500ms. Team có 2 devs, 1 tuần. Fix ít tệ nhất?

A. Cache API response trong Redis với TTL 60s — TTFB còn 50ms
B. Chuyển sang `getStaticProps` + ISR — pre-build nếu content ít thay đổi
C. Thêm CDN trước Next.js server
D. Dùng `streaming` (React 18) — render giao diện trước, data load sau

**7.** [situation] Bạn push commit chứa secret (API key) lên GitHub. Secret đã bị leaked. Git history:

```
A - B - C - D - E (main)
    ^---secret ở đây
```

Bạn cần xóa secret khỏi history. Cách an toàn nhất?

A. `git revert C` — undo commit chứa secret
B. `git reset --hard HEAD~2` — force push (mất commits D, E)
C. `git rm secret.txt && git commit --amend` — chỉ remove file
D. `git filter-branch` hoặc `git filter-repo` — rewrite history, force push

**8.** [debug] Docker image 1.2GB, deploy mất 8 phút. Bạn thêm `.dockerignore` và dùng multi-stage build, image còn 200MB. Deploy vẫn mất 8 phút. Vấn đề?

A. Network speed từ CI đến registry là bottleneck
B. Container runtime init quá chậm
C. Docker layer caching bị miss vì thứ tự layer không optimized — copy code trước khi install dependencies
D. Image compression level quá cao

**9.** [trade-off] Cần real-time notification cho web app (bid update, auction countdown). Team 3 devs, server budget $1k/tháng. Chọn ít tệ nhất?

A. WebSocket (ws library) — lightweight, kiểm soát hoàn toàn
B. Polling mỗi 5s — dễ implement, không cần maintain connection state
C. WebSocket qua Socket.IO — fallback, rooms, broadcasting sẵn
D. SSE (Server-Sent Events) — đơn giản, built-in reconnection

**10.** [debug] Query chậm sau khi add index mới:

```sql
CREATE INDEX idx_orders_user_created ON orders (user_id, created_at DESC);
```

Query:
```sql
SELECT * FROM orders WHERE user_id = 123 ORDER BY created_at DESC LIMIT 20;
```

Vẫn seq scan. `EXPLAIN` cho thấy `estimated rows` = 1000 nhưng actual user có 200K orders. Vấn đề?

A. PostgreSQL underestimate row count → planner nghĩ seq scan nhanh hơn
B. Index column order sai — `user_id` nên đứng sau `created_at`
C. `LIMIT 20` làm planner không chọn index vì phải sort
D. Index bị corrupt sau khi tạo

**11.** [debug] User A và B cùng edit product price (current = $100). A cập nhật: $100 → $80. B cập nhật: $100 → $90 (B load product trước khi A update). Kết quả: price = $90, update của A bị mất. Table không có version column. Fix ít tệ nhất?

A. Dùng `SELECT ... FOR UPDATE` — lock row khi đọc, prevent concurrent edit
B. Chuyển transaction isolation lên Serializable — PostgreSQL detect conflict và rollback
C. Thêm version column + optimistic lock — B update chỉ thành công nếu version không thay đổi
D. Dùng application-level mutex — Redis lock per product ID

**12.** [trade-off] Team 3 devs xây SaaS mới, cần database schema migration nhanh. Dùng Prisma (type-safe, auto migration) vs raw SQL (kiểm soát hoàn toàn). Chọn ít tệ nhất?

A. Raw SQL migration với `golang-migrate` — kiểm soát mọi thứ
B. Prisma — migration tự động, type-safe, dev nhanh
C. Prisma cho development, raw SQL cho production migration
D. Drizzle ORM — nhẹ hơn Prisma, SQL-like syntax

**13.** [situation] Team nhận alert: error rate tăng từ 0.1% → 2%. Bạn cần tìm nguyên nhân nhanh nhất. Có 3 dashboard: (1) business metrics dashboard (số order, revenue), (2) infrastructure dashboard (CPU, memory, disk), (3) application dashboard (p99 latency, error rate by endpoint, throughput). Dashboard nào cho bạn signal nhanh nhất?

A. Business metrics dashboard — revenue giảm là signal cuối cùng, detect chậm nhất
B. Infrastructure dashboard — CPU tăng là hậu quả, không phải nguyên nhân, detect muộn
C. Cả 3 dashboard cùng lúc — cross-reference cho kết quả nhanh nhất
D. Application dashboard — error rate by endpoint xác định chính xác endpoint lỗi, p99 latency show degradation trước error rate tăng

**14.** [situation] DB master bị crash, replica tự động promote lên master. Ứng dụng mất 10s để reconnect. Một số request bị mất (chưa kịp commit từ master cũ). Cần config gì để giảm thiểu?

A. Tăng `max_connections` trên replica
B. Dùng synchronous replication — mỗi write phải confirm đến ít nhất 1 replica
C. Dùng connection pool với `application_name` để tracking
D. Dùng proxy như HAProxy + `read_on_write_failure` = true

**15.** [debug] React Context consumer components re-render không cần thiết khi context value là object mới mỗi render:

```tsx
const value = { user, theme }
return <AppProvider value={value}>...</AppProvider>
```

Fix ít tệ nhất?

A. `useMemo` cho context value — chỉ thay đổi khi `user` hoặc `theme` thay đổi
B. Tách thành 2 context riêng — `UserContext` và `ThemeContext`
C. Dùng `zustand` thay vì Context API
D. Dùng `React.memo` trên tất cả consumer components

---

### Essay 1 — Order Matching Engine (Algorithm/Logic)

**Context:**
Fintech startup 4 devs, cần MVP trong 6 tuần. Build order matching engine (bán order khớp với mua order). Compliance yêu cầu audit trail đầy đủ — mọi match phải ghi lại ai match lúc nào. Volume 100 order/s, cần latency < 100ms.

**Yêu cầu:**
Có 3 approach:
- **Approach A:** In-memory matching (sorted list bids/asks trong Node.js process, lock-free data structure)
- **Approach B:** PostgreSQL row-level locking — `SELECT ... FOR UPDATE SKIP LOCKED` — matching qua stored procedure
- **Approach C:** Redis Streams — order push vào stream, consumer pop và match, kết quả ghi vào DB

**Câu hỏi (trả lời tối đa 500 từ):**
1. Chọn 1 approach cho production. Vì sao reject 2 approach còn lại?
2. Server crash → in-memory state mất toàn bộ → phục hồi trong bao lâu? Data loss có chấp nhận được không?
3. Business constraint (team 4 người, 6 tuần, compliance audit) thay đổi gì trong decision của bạn?

---

### Essay 2 — Collaborative Document Editing (Database)

**Context:**
SaaS startup 3 devs, 2 tháng để build collaborative document editor (Google Docs style). Cần support 1000 concurrent users editing cùng document. Mỗi thao tác (insert/delete character) phải đồng bộ real-time.

**Yêu cầu:**
Có 3 approach:
- **Approach A:** OT (Operational Transformation) — server transform operations sequence
- **Approach B:** CRDT (Conflict-free Replicated Data Type) — merge tự động, không cần server resolve conflict
- **Approach C:** Last-Write-Wins — mỗi đoạn văn bản có version, overwrite bằng version mới nhất

**Câu hỏi (trả lời tối đa 500 từ):**
1. Chọn 1 approach. Giải thích reject các approach còn lại.
2. Server crash → recovery: mất last N operations → data inconsistency giữa các clients? Làm sao phát hiện + sửa?
3. Team chỉ 3 người, timeline 2 tháng — approach bạn chọn implement mất bao lâu? Trade-off giữa correctness và time-to-market?

---


## Set 3

### MCQ (15 câu)

**1.** [debug] Node.js process crash không stack trace, không log. `dmesg` show:

```
Out of memory: Killed process 12345 (node)
```

RAM server 2GB, Node heap 1.5GB. `process.memoryUsage()` trước crash: heapUsed 1.2GB. Vấn đề?

A. V8 heap vượt quá `--max-old-space-size` (mặc định 2GB trên 64-bit)
B. `Buffer.alloc()` không được garbage collect
C. libuv thread pool leak
D. Node.js bị OOM Killer từ Linux vì memory gồm cả heap + non-heap (native bindings) overflow RAM

**2.** [debug] Cache-aside pattern: thread A đọc DB (value=1) → set Redis. Thread B ghi DB (value=2) → delete Redis. Thread A (chậm hơn) set Redis = 1. Kết quả: Redis có value=1, DB có value=2 — cache stale overwrite. Nguyên nhân sâu xa?

A. Cache TTL quá dài — dữ liệu stale tồn tại trong cache quá lâu
B. Race condition giữa read + set cache: write delete cache nhưng read set lại giá trị cũ — cần write-through hoặc read không set nếu cache vừa bị xóa
C. DB write không transaction — nên dùng transaction để atomic write + cache invalidation
D. Concurrent write conflict — cần optimistic lock ở DB

**3.** [trade-off] App upload user images. Cần serve ảnh nhanh, resize nhiều kích thước. Budget $2k/tháng infra. Team 2 devs. Chọn ít tệ nhất?

A. Lưu trong PostgreSQL bytea + app tự resize bằng sharp khi serve
B. Lưu S3 + CloudFront CDN — serverless resize với Lambda@Edge
C. Dùng imgix (third-party image CDN) — resize qua URL params
D. Lưu S3 + tự host Thumbor (image processing server) trên EC2

**4.** [debug] PostgreSQL connection pool cạn kiệt dù chỉ có 50 concurrent users. `pg_stat_activity` cho thấy hàng trăm connection ở state `idle in transaction`. Nguyên nhân?

A. ORM không release connection sau transaction — thiếu `pool.end()` hoặc connection leak
B. PostgreSQL `max_connections` set quá thấp
C. `statement_timeout` quá ngắn gây connection kill
D. `pgBouncer` transaction mode gây connection leak

**5.** [trade-off] Business logic phức tạp (tính lãi suất, thuế, phạt trễ hạn theo nhiều luật). Nên đặt logic ở đâu?

A. Stored procedure trong PostgreSQL — gần data, transactional
B. Application layer (Node.js) — dễ test, version control, deploy
C. Cả 2 — validate ở DB (trigger), tính toán ở app
D. Database function (PL/pgSQL) + cache result trong Redis

**6.** [situation] Production incident: 15% user không thể checkout. 85% user hoạt động bình thường. Error rate tăng từ 0.2% lên 3%. CPU/memory/DB metrics đều bình thường. Bước đầu tiên?

A. Restart toàn bộ servers — reset state, may fix nếu là memory leak
B. Rollback toàn bộ version gần nhất — safe approach nếu không xác định được nguyên nhân
C. Scale up infrastructure — nếu là capacity issue, thêm server giúp
D. Check recent deploy logs và feature flags — partial outage thường do canary rollout hoặc gradual feature release ảnh hưởng subset user

**7.** [debug] WebSocket authentication: client gửi JWT trong query param khi connect. Server verify JWT ở `connection` event. Bạn nhận thấy attacker có thể kết nối với JWT của user khác nếu JWT đó chưa expire. Thiếu gì?

A. JWT không bind với IP/fingerprint — replayed từ attacker machine
B. JWT không có `iat` claim — không detect được token bị stolen từ lúc nào
C. WebSocket URL bị log ở proxy — JWT lộ trong query param thay vì trong message đầu tiên
D. Server không kiểm tra `exp` claim

**8.** [trade-off] Cần deploy web app cho 5K users, traffic theo mùa (black Friday gấp 100x). Team 2 devs, budget $500/tháng. Chọn ít tệ nhất?

A. Một VPS mạnh (64GB RAM, 16 cores) — scale vertical khi cần
B. Kubernetes cluster 3 nodes — scale horizontal auto
C. Serverless (Lambda + DynamoDB) — auto scale, zero management
D. App Runner + RDS serverless — simple deploy, DB auto scale

**9.** [situation] PostgreSQL query chạy chậm khi join 3 tables. Query plan cho thấy nested loop join mặc dù hash join nhanh hơn. `random_page_cost` và `seq_page_cost` default. DB chạy trên SSD. Nên?

A. Add index cho tất cả join columns
B. Dùng `SET enable_nestloop = off`
C. Partition tables để giảm scan size
D. Set `random_page_cost = 0.1` (match SSD speed) — planner chọn hash join

**10.** [debug] API rate limit 100 req/min/user (fixed window reset). User gửi 200 requests trong 1 phút → rate limit trả về 429. Client retry với exponential backoff (1s, 2s, 4s...). Backoff kéo dài sang phút sau. Khi counter reset ở phút mới, tất cả request retry đồng loạt thành công — tạo burst 50 requests ngay lập tức. Vấn đề?

A. Retry không có jitter — backoff fixed làm đồng bộ hóa retry
B. Fixed window rate limit + retry backoff tạo burst khi window reset — cần sliding window + Retry-After header để tránh burst
C. Rate limit counter reset quá nhanh — cần counter persist xuyên suốt
D. Client retry không giới hạn số lần — cần max retry = 3

**11.** [trade-off] E-commerce product page cần load 50 products, mỗi product có 5 ảnh. Lazy load ảnh giúp giảm initial load nhưng gây layout shift. Chọn ít tệ nhất?

A. Eager load tất cả ảnh — dùng CDN, optimal format, preconnect
B. Lazy load native `loading="lazy"` + `width`/`height` attributes cho aspect ratio
C. Blur placeholder (LQIP) — load ảnh nhỏ trước, transition lên ảnh full
D. Intersection Observer + progressive JPEG — load dần theo scroll

**12.** [debug] Docker build chậm (10 phút) mặc dù đã optimize layer caching. Dockerfile:

```dockerfile
FROM node:18
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
CMD ["npm", "start"]
```

Bottleneck rõ nhất?

A. `COPY . .` copy node_modules trước khi chạy `npm install`
B. Thiếu `.dockerignore` — copy toàn bộ folder kể cả file không cần thiết
C. `node:18` image quá nặng — dùng `node:18-alpine`
D. `npm install` chạy sau `COPY . .` — cache bị miss mỗi khi source code thay đổi

**13.** [trade-off] Public API cần rate limiting. Traffic: 1000 request/s peak. Team 2 devs cần setup trong 1 tuần. Budget cloud $500/tháng. Chọn ít tệ nhất?

A. Redis + custom middleware — centralized counter, sliding window
B. API Gateway (AWS/Azure managed) — rate limiting built-in
C. Nginx `limit_req` — built-in, zero maintenance
D. PostgreSQL `INSERT INTO rate_limits` — dùng DB làm counter

**14.** [debug] PostgreSQL full-text search chậm (1s cho 50K documents). Dùng `GIN` index trên `to_tsvector('english', content)`. Search query:

```sql
SELECT * FROM articles WHERE to_tsvector('english', content) @@ to_tsquery('english', 'search term');
```

Vấn đề?

A. `to_tsvector` được gọi lại trên mỗi row — không dùng index
B. GIN index chậm cho UPDATE — cần `gin_trgm_ops` cho LIKE search
C. Search term quá ngắn — tsquery ignore stop words
D. `GIN` index không support `ORDER BY` sorting

**15.** [trade-off] Deploy strategy cho web app critical (downtime = $10K/phút). Team 3 devs, stack Node.js + PostgreSQL. Chọn ít tệ nhất?

A. Rolling update — từng instance restart, zero-downtime lý thuyết
B. Canary release — 5% traffic lên version mới trước, monitor rồi full roll out
C. Blue-green deployment — 2 environment đầy đủ, switch traffic
D. Feature flags — deploy code nhưng tắt tính năng cũ, bật khi ready

---

### Essay 1 — Distributed Unique ID Generator (Algorithm/Logic)

**Context:**
Platform startup, cần distributed ID generation cho 100K IDs/second. ID phải unique globally, sortable by time, 64-bit. Team 2 devs, cần tích hợp trong 1 tuần.

**Yêu cầu:**
Có 3 approach:
- **Approach A:** Snowflake-style — timestamp(41) + machine_id(10) + sequence(12)
- **Approach B:** PostgreSQL sequence (`CREATE SEQUENCE`) + batch fetch
- **Approach C:** UUID v7 — time-ordered, built-in, không cần infra

**Câu hỏi (trả lời tối đa 500 từ):**
1. Chọn 1 approach. Vì sao reject 2 approach còn lại?
2. Clock skew giữa các machines → duplicate ID có thể xảy ra? Phát hiện + cleanup thế nào?
3. Team 2 người, 1 tuần tích hợp — approach bạn chọn implement phức tạp đến đâu? Cost (triển khai + maintain) là gì?

---

### Essay 2 — Hotel Room Booking (Database)

**Context:**
Travel booking startup, legacy system cần migrate trong 4 tuần. Team 3 devs. Xử lý double-booking prevention — 2 users không thể book cùng phòng cùng đêm.

**Yêu cầu:**
Có 3 approach:
- **Approach A:** `SELECT ... FOR UPDATE` trong transaction — lock row availability
- **Approach B:** Exclusion constraint (`USING gist (room_id WITH =, daterange(check_in, check_out) WITH &&)`) — DB tự reject
- **Approach C:** Application-level lock (Redis `SETNX` + TTL) + optimistic lock ở DB

**Câu hỏi (trả lời tối đa 500 từ):**
1. Chọn 1 approach. Vì sao reject 2 cái còn lại?
2. Race condition xảy ra → double booking vẫn happened dù đã dùng approach của bạn? Làm sao detect + compensate (hoàn tiền, notify)?
3. Legacy migration 4 tuần — data integrity cũ (double booking tồn tại trong legacy) xử lý sao? Team 3 người đủ không?

---


## Set 4

### MCQ (15 câu)

**1.** [debug] Legacy Node.js code:

```javascript
function getUser(userId, cb) {
  db.query('SELECT * FROM users WHERE id = ?', [userId], (err, rows) => {
    if (err) return cb(err)
    cb(null, rows[0])
  })
}

function getOrders(userId, cb) {
  db.query('SELECT * FROM orders WHERE user_id = ?', [userId], (err, rows) => {
    if (err) return cb(err)
    cb(null, rows)
  })
}

getUser(1, (err, user) => {
  getOrders(user.id, (err, orders) => {
    // logic
  })
})
```

Vấn đề lớn nhất khi scale?

A. Callback hell — khó maintain nhưng không ảnh hưởng performance
B. Query không dùng parameterized SQL — SQL injection risk
C. Error từ getOrders không được handle
D. Sequential execution — 2 query chạy tuần tự thay vì song song

**2.** [situation] React build production ra bundle 2.5MB. App đơn giản (dashboard + table). `webpack-bundle-analyzer` cho thấy `moment.js` chiếm 500KB (chủ yếu locales). Fix ít tệ nhất?

A. `moment.js` → `dayjs` (2KB) — API tương thích
B. Dynamic import `moment` — chỉ load khi cần
C. Code split theo route — page nào dùng `moment` thì load riêng
D. Dùng `webpack.IgnorePlugin` để exclude locale files không dùng

**3.** [trade-off] Cần cache layer cho API response. Data ít thay đổi (update 1 lần/giờ), read 1000 request/s. Team 2 devs. Chọn ít tệ nhất?

A. Memcached — đơn giản, multi-thread, không cần persist
B. In-process cache (`Map` + TTL) — zero network latency
C. Redis — in-memory, TTL, eviction policy configurable
D. CDN (Cloudflare APO) — cache ở edge

**4.** [debug] PostgreSQL index `idx_orders_status` trên column `status` (3 giá trị: pending, completed, cancelled). Query `SELECT * FROM orders WHERE status = 'pending'` vẫn seq scan. Tại sao?

A. Column cardinality quá thấp (3 unique values) — planner ưu tiên seq scan
B. Index bị corrupt sau REINDEX
C. `WHERE status = 'pending'` match 33% rows — planner chọn bitmap scan
D. Index type sai — cần partial index `WHERE status = 'pending'`

**5.** [situation] Production DB connection pool exhausted (100% connections used). Tất cả API request timeout. `pg_stat_activity` cho thấy 80% connections ở state `idle in transaction`. Cần restore service nhanh nhất. Bước đầu tiên?

A. Kill idle transactions via `pg_terminate_backend` — giải phóng connections ngay lập tức, service hồi phục trong giây
B. Tăng `max_connections` lên gấp đôi — giải phóng request đang chờ
C. Restart database server — force close all connections, nhưng downtime thêm 30s-60s
D. Kill application server — force release connections từ app side

**6.** [situation] Git repo có 2 branches: `main` và `feature`. `feature` có commit F. `main` mới thêm commit M.

```
A - B - C - M (main)
     \
      D - E - F (feature)
```

Chạy `git merge feature` trên `main`. Xuất hiện conflict. Bạn resolve xong, commit merge. Lịch sử trông thế nào?

A. `A - B - C - M - D - E - F (main)` — linear history
B. `A - B - C - M - F (main)` — chỉ lấy commit F
C. Conflict không thể resolve — Git hủy merge
D. `A - B - C - M - Merge(F) (main)`, merge commit có 2 parents: M và F

**7.** [situation] Next.js ISR page hiển thị content cũ dù đã set `revalidate: 60`. Content được update từ CMS (webhook gọi API). Sau 60s vẫn cũ. Vấn đề?

A. Cache CDN (phía trước Next.js) không respect `stale-while-revalidate`
B. Next.js ISR cần API route `res.revalidate()` thay vì chờ time-based
C. `getStaticProps` không được gọi lại vì webhook sai format
D. `fallback: 'blocking'` ngăn page revalidate

**8.** [trade-off] Cần managed PostgreSQL. Database 100GB, read replica cần latency < 5ms. Team 3 devs, không có DBA. Chọn ít tệ nhất?

A. RDS PostgreSQL — quen thuộc, dễ setup, Multi-AZ
B. Self-hosted PostgreSQL trên EC2 — full control, rẻ hơn
C. Aurora PostgreSQL — faster replica, auto scaling storage
D. Cloud SQL (GCP) — similar RDS, automatic backup

**9.** [debug] WebSocket connection bị drop sau đúng 60s. Server log: "ping timeout". Server config `pingInterval = 30000, pingTimeout = 30000`. Client không gửi pong. Vấn đề?

A. Client không handle `ping` event từ server
B. `pingInterval + pingTimeout = 60s` → chính xác thời gian drop
C. Server `heartbeat` interval không align với network firewall
D. WebSocket proxy (Nginx, ALB) có `proxy_read_timeout = 60s` đóng connection

**10.** [situation] Zero-downtime deploy cho Node.js app. Bạn dùng PM2 cluster mode, rolling restart. Trong lúc restart, request mới vẫn vào instance cũ (chuẩn bị stop). Gây 502 error. Cần?

A. Graceful shutdown (SIGTERM handler: stop accept, drain connections)
B. Tăng `pm2 reload` timeout — cho request cũ complete trước
C. Tăng số lượng instances lên 4 để có buffer
D. Dùng `pm2 startOrReload` thay vì `pm2 reload`

**11.** [debug] Query dùng CTE chậm hơn subquery tương đương:

```sql
WITH popular AS (
  SELECT product_id, COUNT(*) FROM orders GROUP BY product_id ORDER BY count DESC LIMIT 10
)
SELECT * FROM products WHERE id IN (SELECT product_id FROM popular);
```

PostgreSQL 12. Vấn đề?

A. CTE không dùng index — phải full scan orders table
B. `LIMIT 10` trong CTE không hoạt động như subquery
C. CTE là optimization fence — planner không push filter vào trong CTE
D. PostgreSQL 12 chưa hỗ trợ CTE materialize

**12.** [trade-off] Background job xử lý 10K emails. Cần gửi không mất email nào, có retry. Team 2 devs, cloud budget $300/tháng. Chọn ít tệ nhất?

A. Bull (Redis-backed queue) — persistent, retry with backoff
B. SQS + Lambda — serverless, auto retry, DLQ
C. In-process queue (`async.queue`) — đơn giản, không cần infra
D. RabbitMQ — robust, ACK mechanism, management UI

**13.** [situation] React Suspense kết hợp với component fetch data. Component throw promise → Suspense catch fallback. Khi promise resolve, component render lại. User thấy loading ban đầu, sau đó content hiện ra, nhưng rồi lại loading lần nữa. Vấn đề?

A. `useEffect` trong suspended component chạy sau khi mount
B. Missing `<ErrorBoundary>` — error không được catch
C. Suspense chỉ works với React.lazy, không phải data fetching
D. Component tạo promise mới mỗi render → Suspense infinite loop

**14.** [debug] Docker container không thể kết nối đến host PostgreSQL. Container chạy với `--network host` thì OK, nhưng `--network bridge` (mặc định) thì fail. Vì sao?

A. Bridge network không có DNS resolution cho host
B. Container firewall block port 5432
C. PostgreSQL chỉ listen 127.0.0.1 → không accept connection từ bridge network
D. Docker bridge không hỗ trợ TCP

**15.** [trade-off] Startup phase, team 1-5 devs, product-market fit chưa rõ. Cần kiến trúc linh hoạt để pivot. Chọn ít tệ nhất?

A. Modular monolith — packages rõ ràng, single deploy, dễ extract sau
B. Microservices — mỗi domain 1 service, dễ thay đổi độc lập
C. Serverless — zero infra management, pay per use
D. Clean Architecture (layered) — domain độc lập với framework

---

### Essay 1 — Rate Limiting & DDoS Protection (Algorithm/Logic)

**Context:**
API startup 2 devs, cần rate limiting + DDoS protection trong 2 tuần. Cloud budget $500/tháng. 10 endpoints, traffic 500 request/s peak. Nếu bị DDoS 10K request/s, hệ thống phải survive.

**Yêu cầu:**
Có 3 approach:
- **Approach A:** Nginx `limit_req_zone` + `limit_conn_zone` — zero code, config only
- **Approach B:** Redis + custom middleware (sliding window log) — kiểm soát hoàn toàn, per-user rate limit
- **Approach C:** Cloudflare API Gateway (managed WAF + rate limiting) — $200/tháng

**Câu hỏi (trả lời tối đa 500 từ):**
1. Chọn 1 approach. Vì sao reject 2 approach còn lại?
2. Redis crash → rate limit không hoạt động → server quá tải → recovery trong bao lâu? Làm sao prevent cascading failure?
3. Business constraint (2 người, 2 tuần, $500/tháng) — approach bạn chọn có đủ để survive 10K request/s DDoS không? Nếu không thì fallback plan?

---

### Essay 2 — Zero-downtime Database Migration (Database)

**Context:**
200M rows table cần thêm column + backfill data từ column cũ. Max downtime cho phép 30s. Team 4 devs.

**Yêu cầu:**
Có 3 approach:
- **Approach A:** `ALTER TABLE ... ADD COLUMN` + `UPDATE` in transaction — downtime toàn bộ thời gian migrate
- **Approach B:** Expand-contract — thêm column nullable, app ghi cả 2 column, backfill background job
- **Approach C:** Create new table + dual-write + rename

**Câu hỏi (trả lời tối đa 500 từ):**
1. Chọn 1 approach. Vì sao reject 2 approach còn lại?
2. Backfill job crash ở row 100M — resume strategy? Data inconsistency giữa old column và new column trong lúc backfill?
3. 200M rows migrate phải complete trong 30s downtime — approach bạn chọn có đáp ứng không? Nếu không, cần thêm gì (tool, strategy)?

---


## Set 5

### MCQ (15 câu)

**1.** [debug] Node.js server chạy được 2 tuần thì bắt đầu throw "Error: EMFILE: too many open files". `lsof -p <pid>` cho thấy 10K file descriptors open. Vấn đề?

A. `fs.readFile` gọi quá nhiều cùng lúc
B. Node.js event loop too slow → fd queue backlog
C. `ulimit -n` set quá thấp (mặc định 1024)
D. File descriptor leak — stream hoặc socket không được close

**2.** [situation] React stale closure:

```tsx
function Timer() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      console.log(count)
    }, 1000)
    return () => clearInterval(id)
  }, [])
}
```

`count` luôn là 0 trong interval. Vì sao?

A. `useEffect` capture count = 0 từ render đầu tiên — closure không update
B. `setInterval` callback không trigger re-render
C. `count` là primitive — không thể reference qua component lifecycle
D. Component unmount ngay sau mount

**3.** [trade-off] Startup xây social feed. Data highly relational (user, post, comment, like, share). Team 3 devs, PostgreSQL hiện tại. Cần scale cho 10M users. Chọn ít tệ nhất?

A. Chuyển sang MongoDB — schema linh hoạt, embedded comments
B. Hybrid — PostgreSQL cho transactional, Elasticsearch cho feed search
C. Stick với PostgreSQL — index optimization, read replica, partitioning
D. DynamoDB — auto scale, single-digit ms latency

**4.** [debug] Git: bạn checkout commit cũ (detached HEAD), sửa file, commit. Khi checkout lại branch khác, commit mới biến mất. Cách tìm lại?

A. `git reflog` — tìm commit hash từ trước khi checkout branch
B. Cả `git reflog` và `git fsck --lost-found`, nhưng `git reflog` là nhanh nhất
C. `git log --all` — commit vẫn còn trong object store
D. `git fsck --lost-found` — recover dangling commit

**5.** [trade-off] IoT devices gửi data mỗi 5 phút. 10K devices, mỗi lần gửi 1KB. Cần real-time dashboard + lưu history. Chọn ít tệ nhất?

A. Event-driven — devices gửi HTTP, Kafka ingest, consumer ghi DB
B. Polling — devices lưu local, server pull mỗi 5 phút
C. WebSocket persistent connection — real-time, devices push
D. Batch upload mỗi giờ — devices gom data, upload 1 file

**6.** [situation] Team budget hạn chế, chỉ được chọn 3 metrics để alert cho production system. Mục tiêu: detect issue sớm nhất trước khi user bị ảnh hưởng. 3 metrics nào?

A. CPU, memory, disk IO — infrastructure metrics phát hiện khi tài nguyên cạn, trễ hơn application metrics
B. Throughput, DB query count, cache hit ratio — throughput giảm khi đã có issue, cache hit ratio ít ảnh hưởng trực tiếp
C. p99 latency, error rate, connection pool usage — p99 detect degradation trước average, error rate catch failures, connection pool predict exhaustion
D. Number of 5xx, number of 4xx, average response time — 5xx đã là hậu quả, average response time trễ hơn p99

**7.** [debug] WebSocket server gửi message đến client nhưng phía client không nhận được. Server log: `send()` success (no error). Client vẫn online (ping/pong OK). Vấn đề?

A. Backpressure — server send nhanh hơn client consume → buffer full → message dropped silently
B. WebSocket frame bị fragmentation — reassembly fail ở client
C. Message > 1MB — WebSocket default max payload
D. Client browser tab background — `requestAnimationFrame` pause

**8.** [trade-off] Deploy 10 services. Cần minimize downtime (SLA 99.99%). Team 5 devs, budget trung bình. Chọn ít tệ nhất?

A. Blue-green deployment — full infra nhân đôi, chi phí gấp đôi
B. Rolling deployment — từng instance, chi phí thấp
C. Canary release — traffic splitting, cần service mesh
D. A/B test deployment — feature flags, gradual rollout

**9.** [debug] Admin update product price trong DB (value mới = $50). Cache (Redis) TTL = 5 phút vẫn trả price cũ ($45). User thấy price sai. App dùng cache-aside (read: check cache → miss → read DB → set cache; write: write DB → delete cache). Debug log: cache miss xảy ra, read DB đúng ($50), nhưng Redis SET lại giá trị cũ ($45). Làm sao?

A. Cache TTL chưa expire — dữ liệu vẫn còn trong cache nên read không miss
B. Redis write conflict — concurrent write từ admin và read request
C. DB transaction chưa commit khi read — dirty read từ read uncommitted
D. Race condition: write DB + delete cache, nhưng có read cũ đang chạy — read thấy cache miss, đọc DB (giá trị cũ trước khi write hoàn tất), set cache = value cũ

**10.** [debug] PostgreSQL table `orders` có 50M rows. `DELETE FROM orders WHERE created_at < '2020-01-01'` xóa 20M rows. Chạy xong, query vẫn chậm. `pg_stat_user_tables` cho thấy `n_dead_tup` cao. Cần?

A. `REINDEX TABLE orders` — rebuild index bị bloated
B. `ANALYZE orders` — cập nhật statistics cho planner
C. `VACUUM FULL orders` — reclaim disk space, update statistics
D. `CLUSTER orders USING orders_pkey` — physically reorder

**11.** [trade-off] Cần API versioning cho public API có 50 clients. Backward compatibility quan trọng. Chọn ít tệ nhất?

A. Header versioning (`Accept: application/vnd.api+json;version=2`) — clean URI
B. URI versioning (`/v1/`, `/v2/`) — rõ ràng, dễ route
C. Query param versioning (`?v=2`) — dễ test
D. No versioning — evolve API, notify clients breaking changes

**12.** [situation] Next.js Image Optimization (`next/image`) hoạt động chậm trên production. Mỗi image request mất 1s để optimize (resize, convert WebP). Server CPU 100%. Vấn đề?

A. CDN không cache image optimized — mỗi request đều re-optimize
B. `next/image` không hỗ trợ remote images từ domain không whitelist
C. `sharp` library không được cài — fallback sang slower implementation
D. Image optimization là CPU-bound — build-time optimization thay vì runtime

**13.** [debug] React `useReducer` dispatch không trigger re-render:

```tsx
const [state, dispatch] = useReducer(reducer, initialState)

const handleClick = () => {
  dispatch({ type: 'INCREMENT' })
  console.log(state.count)
}
```

`state.count` vẫn là 0 sau dispatch. Vì sao?

A. `dispatch` là async — state chưa update tại thời điểm log
B. Component bị unmount trước khi re-render
C. `reducer` trả về state cũ (không mutate đúng)
D. `useReducer` không trigger re-render nếu action type không match

**14.** [trade-off] Startup cần scale từ 1K → 100K users trong 6 tháng. Không biết pattern traffic. Budget hạn chế. Chọn ít tệ nhất?

A. Vertical scaling (tăng RAM/CPU server) — đơn giản, không đổi kiến trúc
B. Horizontal scaling (thêm server + load balancer) — prepared ngay từ đầu
C. Serverless — auto scale từ 0 đến infinite
D. Database sharding — partition ngay từ đầu

**15.** [situation] Docker health check liên tục fail dù app vẫn hoạt động. Health check:

```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
  interval: 30s
  timeout: 10s
  retries: 3
```

Container bị restart vòng lặp. Log app: health endpoint trả về 200. Vấn đề?

A. `localhost` không resolve được trong container
B. `curl` không có trong container image — health check luôn fail
C. Health check timeout quá ngắn — 10s không đủ cho TCP handshake
D. `interval` quá ngắn — app chưa kịp start

---

### Essay 1 — Background Job Queue (Algorithm/Logic)

**Context:**
Marketing SaaS startup 3 devs, cần gửi 1M email marketing/tháng. Email quan trọng (newsletter, reset password, invoice). Không được gửi thiếu email nào, có retry + dedup. Budget infra $1k/tháng.

**Yêu cầu:**
Có 3 approach:
- **Approach A:** Bull (Redis) — job queue, retry with backoff, rate limiter, job events
- **Approach B:** SQS + Lambda — fully managed, DLQ, visibility timeout
- **Approach C:** PostgreSQL SKIP LOCKED — `SELECT ... FOR UPDATE SKIP LOCKED LIMIT 100` — không cần infra mới

**Câu hỏi (trả lời tối đa 500 từ):**
1. Chọn 1 approach. Vì sao reject 2 approach còn lại?
2. Redis crash → jobs bị mất? Recovery lâu? Dedup làm sao để không gửi email trùng?
3. Business constraint: 3 devs, $1k/tháng, email critical — approach có đáp ứng không? Fallback nếu queue bị stuck?

---

### Essay 2 — Autocomplete Search (Database)

**Context:**
E-commerce startup 5 devs, cần autocomplete cho product search trong 3 tuần. 500K products. Phản hồi < 100ms sau mỗi keystroke. Không thể dùng Elasticsearch (không có DevOps).

**Yêu cầu:**
Có 3 approach:
- **Approach A:** PostgreSQL `LIKE 'prefix%'` + `GIN` trigram index (`pg_trgm`)
- **Approach B:** Redis Sorted Set prefix-based — `ZADD autocomplete 0 product_name`, `ZRANK` + `ZRANGE` để lấy suggest
- **Approach C:** Trie in-memory (Node.js) — build trie từ product names, search O(n)

**Câu hỏi (trả lời tối đa 500 từ):**
1. Chọn 1 approach. Vì sao reject 2 approach còn lại?
2. Redis crash (approach B) hoặc process restart (approach C) → service down trong bao lâu? Cache warmup strategy?
3. Team 5 người, 3 tuần, không Elasticsearch — approach của bạn đủ nhanh (< 100ms) cho 500K products không? Scale lên 5M sản phẩm thì sao?

---


## Đáp án

### Set 1
1.B. 2.D. 3.C. 4.C. 5.C. 6.A. 7.D. 8.B. 9.D. 10.A. 11.C. 12.A. 13.B. 14.B. 15.A

### Set 2
1.C. 2.A. 3.D. 4.B. 5.A. 6.B. 7.D. 8.C. 9.D. 10.A. 11.C. 12.B. 13.D. 14.B. 15.A

### Set 3
1.D. 2.B. 3.C. 4.A. 5.B. 6.D. 7.A. 8.C. 9.D. 10.B. 11.B. 12.D. 13.C. 14.A. 15.C

### Set 4
1.B. 2.D. 3.C. 4.A. 5.A. 6.D. 7.B. 8.C. 9.D. 10.A. 11.C. 12.B. 13.D. 14.C. 15.A

### Set 5
1.D. 2.A. 3.C. 4.B. 5.A. 6.C. 7.A. 8.B. 9.D. 10.C. 11.B. 12.D. 13.C. 14.A. 15.B

## Rubric chấm

### MCQ scoring
| Số câu đúng | Điểm |
|------------|------|
| 15/15 | 24 |
| 14/15 | 22 |
| 13/15 | 20 |
| 12/15 | 18 |
| 11/15 | 16 |
| 10/15 | 14 |
| 9/15 | 12 |
| 8/15 | 10 |
| 7/15 | 8 |
| 6/15 | 6 |
| ≤5/15 | 0 |

### Essay rubric (thang 4 level × 4 tiêu chí = 24 điểm)
| Tiêu chí | Fails (0) | Weak (2) | Good (4) | Excellent (6) |
|----------|-----------|----------|----------|---------------|
| **Approach** | Không chọn được approach, không biện luận | Chọn đúng approach nhưng không defend được | Chọn + defend tốt, reject approach khác có lý do | Chọn defend xuất sắc, phân tích được context quyết định decision |
| **Edge cases & Failure recovery** | Không nêu được edge case nào | Nêu được 1-2 edge cases nhưng không có giải pháp | Nêu được edge cases + recovery plan cụ thể (RTO/RPO) | Phân tích failure scenarios sâu, có fallback plan, detect inconsistency |
| **Trade-off & constraints** | Không nhận biết được trade-off | Nhận biết trade-off nhưng không giải quyết | Phân tích trade-off với business constraints (cost, team, timeline) | Cân bằng tech vs business, đưa ra quyết định sáng suốt với constraint |
| **System thinking** | Chỉ nói 1 layer | Nói được 2-3 layers (app, DB, network) | Phân tích system-wide impact của decision | Thiết kế có tính đến monitoring, recovery, scale, và evolution |

### Final composite grade
| Tổng điểm (MCQ + Essay) /48 | Grade | Level |
|---------------------------|-------|-------|
| < 24 | **Fail** | Junior |
| 24 - 31 | **Pass** | Mid |
| 32 - 38 | **Strong Pass** | Mid+ / Senior |
| 39 - 44 | **High Pass** | Senior |
| 45 - 48 | **Excellent** | Staff+ |
