# BỘ ĐỀ TEST FULLSTACK DEVELOPER (3+ NĂM) — PHIÊN BẢN NÂNG CẤP
> Node.js · TypeScript · React/Next.js · PostgreSQL · DevOps  
> **Tập trung: debugging scenarios · trade-off · failure · race condition · system thinking**  
> Không có câu hỏi định nghĩa thuần túy — mọi câu đều có context production thực tế

---

## PHÂN LOẠI CÂU HỎI THEO TYPE

| Type | Mô tả | Tác dụng phân loại |
|------|--------|-------------------|
| 🐛 **Debugging** | Production incident, tìm root cause | Phân biệt senior vs mid |
| ⚖️ **Trade-off** | Không có đáp án tuyệt đối, phụ thuộc context | Detect system thinking |
| 💥 **Failure** | Component bị down, system phản ứng thế nào | Đánh giá reliability mindset |
| 🔒 **Race condition** | Concurrency, data integrity | Kinh nghiệm production thực tế |
| 📈 **Scale** | Bottleneck, scaling strategy | Architecture maturity |

---

## 🧪 TEST SET 1

### Part 1: Multiple Choice (15 câu)

**Câu 1.** [🐛 Debugging] API `/checkout` bị report: đôi khi user bị charge 2 lần trong cùng 1 đơn hàng. Server logs cho thấy 2 POST requests cùng `order_id` đến trong 500ms. Nguyên nhân gốc rễ và fix đúng hướng?

A. Frontend gửi double request khi network chậm; fix: idempotency key trên API — server dedup bằng key này, request thứ 2 return cached result  
B. Database transaction bị auto-retry gây duplicate insert  
C. Load balancer route 2 requests đến 2 app servers khác nhau  
D. JWT token bị reuse bởi 2 browser tabs  

---

**Câu 2.** [📈 Scale/Bottleneck] Node.js server: CPU 12%, RAM 35%, nhưng p99 latency = 5s khi có 2.000 concurrent users (p50 = 60ms vẫn tốt). Database query avg 15ms. Bottleneck likely nhất ở đâu?

A. Node.js event loop bị block bởi synchronous CPU-intensive operation  
B. PostgreSQL connection pool bị exhausted — requests phải queue chờ connection available  
C. GC pauses của V8 làm freeze event loop định kỳ  
D. Memory không đủ cho 2.000 concurrent HTTP connections  

---

**Câu 3.** [🔒 Race condition] Hệ thống gift voucher: `stock = 1`, 2 users claim cùng lúc. Code: `SELECT stock WHERE id=X` → nếu stock > 0 thì `UPDATE stock = stock - 1`. Cả 2 thành công → `stock = -1`. Fix database-level gọn nhất?

A. Tăng isolation level lên SERIALIZABLE cho toàn DB  
B. Redis SETNX distributed lock trước khi vào DB  
C. `UPDATE vouchers SET stock = stock - 1 WHERE id = X AND stock > 0`, check `affected_rows` — nếu 0 thì reject  
D. Thêm CHECK constraint `stock >= 0` (ngăn data âm nhưng không fix race, chỉ là safety net)  

---

**Câu 4.** [🐛 Debugging - React] Product list 200 items re-render toàn bộ mỗi khi user đổi filter dù data không thay đổi. Component đã wrap bằng `React.memo()`. Nguyên nhân khả dĩ nhất?

A. `React.memo()` không hoạt động với list có hơn 100 items  
B. Missing `key` prop gây toàn bộ list bị remount  
C. Parent component tạo mới `onFilterChange` callback mỗi render → `memo()` thấy props thay đổi (reference equality)  
D. State update trong child component trigger re-render lên parent  

---

**Câu 5.** [💥 Failure] Redis bị OOM (Out of Memory), bắt đầu evict keys theo LRU. Hệ thống dùng Redis cho: session storage, rate limiting counters, product catalog cache. Hệ quả nguy hiểm nhất về security?

A. Product cache miss tăng, nhiều queries xuống DB hơn  
B. Sessions bị xóa, users bị logout ngẫu nhiên  
C. Rate limiting counters bị evict → counters reset về 0 → users có thể bypass rate limit tạm thời  
D. Server từ chối nhận request mới vì không còn session storage  

---

**Câu 6.** [⚖️ Trade-off] Next.js page `/products/[id]`: price và inventory update liên tục. SEO quan trọng. Traffic: 100K views/ngày, 70% rơi vào ~500 popular products. Strategy phù hợp nhất?

A. CSR — fetch sau load, SEO kém, không phù hợp  
B. SSG build-time — nhanh nhất nhưng data luôn stale  
C. SSR mỗi request — luôn fresh nhưng tốn resource, không scale tốt  
D. ISR (revalidate: 60s) — static performance cho popular products, auto-refresh định kỳ, SEO tốt  

---

**Câu 7.** [🐛 Debugging - N+1] API `/api/orders` trả về 100 orders kèm customer name và product list. DB logs: 301 queries mỗi call API. Vấn đề và hướng fix?

A. Connection pool quá nhỏ, cần tăng pool size  
B. Cần thêm index trên `orders.customer_id`  
C. Tăng query timeout để không bị cut  
D. N+1 problem: 1 query orders + 100 customer queries + 200 product queries. Fix bằng JOIN hoặc DataLoader  

---

**Câu 8.** [Git scenario] Branch `feature/dashboard` cần một commit cụ thể từ `bugfix/chart-fix` mà chưa merge vào main. Cách lấy đúng commit đó mà không merge toàn bộ branch?

A. Merge `bugfix/chart-fix` vào `feature/dashboard` — kéo toàn bộ branch history  
B. Rebase `feature/dashboard` lên `bugfix/chart-fix`  
C. `git cherry-pick <commit-hash>` — lấy đúng 1 commit cần thiết  
D. Tạo branch mới từ `bugfix/chart-fix` và rework từ đó  

---

**Câu 9.** [🐛 Debugging - Memory] Node.js server memory tăng từ 200MB lên 1.8GB sau 8 tiếng, phải restart hàng ngày. Heap snapshot cho thấy `EventEmitter` instances tích lũy. Nguyên nhân phổ biến nhất?

A. Node.js không GC EventEmitter khi chúng out of scope  
B. `emitter.on('data', handler)` gọi trong request handler mà không có `emitter.off()` — mỗi request add thêm 1 listener vĩnh viễn  
C. Quá nhiều concurrent HTTP connections đang mở  
D. `Buffer` objects từ file streams không được release sau khi dùng  

---

**Câu 10.** [⚖️ Trade-off] Bảng `products` có 3M rows. Query `WHERE category_id = X ORDER BY created_at DESC` chạy 2s. Team debate: thêm composite index vs Redis cache. Nên làm gì TRƯỚC?

A. Redis cache — latency thấp hơn index trong mọi trường hợp  
B. Composite index `(category_id, created_at DESC)` — zero infra cost, fix root cause, đủ cho 3M rows  
C. Thêm read replica để scale reads  
D. Denormalize: tạo table riêng per category  

---

**Câu 11.** [💥 Failure - DevOps] Docker container restart liên tục với exit code 137 (OOMKilled). Memory limit 512MB. App thường dùng 350MB nhưng đỉnh điểm xử lý CSV upload lên 700MB. Fix đúng hướng?

A. Tăng memory limit container lên 1GB không cần thay đổi gì khác  
B. Xử lý CSV bằng streams thay vì `fs.readFile()` — memory usage O(chunk) thay vì O(file_size)  
C. Set `--oom-kill-disable` flag cho container  
D. Offload file processing sang dedicated worker service  

---

**Câu 12.** [💥 Failure - PostgreSQL] Primary PostgreSQL crash, replica lag 8 giây. Team promote replica lên primary. Điều gì xảy ra với 8 giây transactions chưa replicate?

A. PostgreSQL tự recover từ WAL archive nếu còn accessible  
B. App server có internal log để replay transactions  
C. Các transactions đó bị mất vĩnh viễn — không recover được nếu không có external backup  
D. Users sẽ thấy lỗi và retry → data được write lại tự động  

---

**Câu 13.** [🐛 TypeScript] Code compile thành công, không có warning. Runtime: `TypeError: Cannot read properties of null`. Nguyên nhân phổ biến nhất trong codebase lớn?

A. `strictNullChecks: false` trong tsconfig → TypeScript không kiểm tra null/undefined, bỏ qua toàn bộ null checks  
B. TypeScript version quá cũ, thiếu null check feature  
C. Sự khác biệt giữa runtime và compile-time environment  
D. `@types` definitions không match runtime library version  

---

**Câu 14.** [📈 Scale - Socket.IO] Chat app scale lên 3 server instances. User A (server 1) gửi message vào room `#general`, User B (server 2) không nhận được. Fix đúng?

A. Sticky sessions tại load balancer — route cùng user đến cùng server (không fix broadcast problem qua servers)  
B. Redis adapter — tất cả instances pub/sub qua Redis channel, room events broadcast cross-instance  
C. Giảm về 1 server instance để tránh vấn đề  
D. Dùng Server-Sent Events thay WebSocket  

---

**Câu 15.** [DevOps] CI pipeline chạy 500 unit tests mất 22 phút. Highest-impact optimization đầu tiên không giảm test coverage?

A. Upgrade CI runner lên instance mạnh gấp đôi  
B. Xóa tests ít giá trị  
C. Parallel test execution — chia tests thành nhiều groups, chạy song song trên multiple workers  
D. Chỉ chạy CI khi merge vào main, skip feature branch pushes  

---

### Part 2: Answer Key

| Câu | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 |
|-----|---|---|---|---|---|---|---|---|---|----|----|----|----|----|-----|
| Đáp án | **A** | **B** | **C** | **C** | **C** | **D** | **D** | **C** | **B** | **B** | **B** | **C** | **A** | **B** | **C** |

> **Ghi chú phân loại:** Câu 3 — ứng viên chọn A (SERIALIZABLE) là mid-level thinking; chọn C là senior thinking (atomic UPDATE, không cần lock). Câu 5 — ứng viên không thấy security implication của rate limit bypass là red flag.

---

### Part 3: Essay Question 1 – System Design

**Đề bài:**

Thiết kế rate limiter cho public REST API với yêu cầu: 1.000 req/phút/user, hỗ trợ burst (tối đa 100 req trong 5 giây vẫn OK), chạy trên nhiều server instances. Không cần code — mô tả approach, data structure trong Redis, và cách xử lý khi Redis down.

**Hướng trả lời:**

- **Algorithm:** Token bucket phù hợp hơn Fixed Window — support burst naturally
- **Redis structure:** `HASH` key `rate_limit:{user_id}` với fields `tokens` và `last_refill_ts`; hoặc Sorted Set với timestamp-based sliding window
- **Atomic operation:** Lua script trong Redis để đảm bảo check-and-decrement atomic (không race condition)
- **Distributed:** Tất cả instances đọc/ghi cùng Redis key → consistent state
- **Redis down:** Circuit breaker — fail open (allow request) với local fallback counter; hoặc fail closed (block) tùy risk tolerance. Cần alert ngay
- **Tradeoff:** Sliding window chính xác hơn nhưng tốn memory hơn Fixed Window

---

### Part 4: Essay Question 2 – Incident / Debug

**Đề bài:**

Users báo số dư tài khoản hiển thị sai — thấy balance cao hơn thực tế sau khi vừa withdraw. F5 lại sau 2-3 giây thì đúng. Xảy ra với ~5% users, không reproduce được trên staging. Mô tả quy trình debug và giải thích nguyên nhân khả dĩ nhất.

**Hướng trả lời:**

- **Root cause khả dĩ nhất:** App đọc từ **read replica** có replication lag 1-3s sau primary — sau khi write vào primary, read từ replica chưa sync → stale data
- **Debug steps:**
  1. Check APM/logs: requests đang đọc từ DB nào (primary hay replica)?
  2. Monitor replication lag của replica
  3. Xác nhận: withdraw API write vào primary, nhưng balance query lại read từ replica
- **Fix:**
  - **Short term:** Sau write operation, đọc lại balance từ primary (read-after-write consistency)
  - **Long term:** Dùng sticky routing — sau write, force next N reads của user đó đến primary trong X giây; hoặc pass write timestamp, replica chỉ serve request khi đã sync đến timestamp đó
- **Red flag khi ứng viên không biết:** Đây là classic distributed systems problem, senior developer phải biết

---
---

## 🧪 TEST SET 2

### Part 1: Multiple Choice (15 câu)

**Câu 1.** [🐛 Debugging] Deploy mới vừa xong. Một số API routes chậm hơn 10x (từ 50ms lên 500ms). DB query time vẫn ổn. Trong code review không thấy gì lạ. Nguyên nhân khả dĩ nhất?

A. Server cần warm-up JIT sau khi restart  
B. N+1 query mới được introduce — code mới gọi extra queries trong vòng lặp mà code review bỏ sót  
C. Load balancer chưa health check xong, route đến unhealthy instance  
D. CDN cache chưa được purge sau deploy  

---

**Câu 2.** [💥 Failure - Stale Read] User vừa transfer $500, F5 ngay thì thấy balance cũ (chưa trừ). 2 giây sau F5 lại thì đúng. Nguyên nhân khả dĩ nhất trong hệ thống production?

A. App đọc từ read replica có replication lag 1-3s sau primary  
B. Browser cache giữ response cũ, không gửi request mới  
C. Transaction chưa được commit vào database  
D. Frontend không invalidate local state sau khi API thành công  

---

**Câu 3.** [🐛 Debugging - PostgreSQL] `SELECT * FROM posts ORDER BY created_at DESC LIMIT 20 OFFSET 100000` chạy chậm dù có index trên `created_at`. Nguyên nhân?

A. LIMIT/OFFSET không tương thích với index scan  
B. ORDER BY DESC không dùng được index mặc định (ASC)  
C. PostgreSQL cần CLUSTER TABLE để fix vấn đề này  
D. OFFSET 100000 buộc DB scan và skip 100K rows trước khi lấy 20 — cursor-based pagination fix vấn đề này  

---

**Câu 4.** [📈 Scale] WebSocket connections của mobile users thường bị drop sau 30-60 giây idle (lock screen, switch app). Server không detect ngay, tiếp tục broadcast vào dead connections. Fix?

A. Giảm reconnection delay client-side xuống 1 giây  
B. Tăng server memory để giữ nhiều connections hơn  
C. Implement heartbeat/ping-pong: client gửi ping mỗi 25s, server close connection nếu không nhận trong 30s  
D. Dùng HTTP long-polling vì stable hơn WebSocket trên mobile  

---

**Câu 5.** [🐛 Debugging - Cache] Sau khi admin update product price, 30% users vẫn thấy giá cũ trong 5-10 phút. Nguyên nhân trong hệ thống có 4 app server instances?

A. Mỗi server instance có in-memory cache riêng — chỉ instance nhận update request mới invalidate cache  
B. Database replication lag  
C. CDN giữ cached response  
D. Admin API và user API dùng khác database connection pool  

---

**Câu 6.** [⚖️ Trade-off - TypeScript] Function nhận `data: any` từ external API, access `data.user.profile.avatar`. TypeScript không lỗi, runtime crash. Fix tốt nhất trong production codebase?

A. Dùng `as unknown as ExpectedType` để cast type  
B. Validate schema với Zod/io-ts tại entry point, infer TypeScript type từ schema — runtime + compile-time safety  
C. Wrap toàn bộ trong try-catch để handle runtime error  
D. Thêm `// @ts-ignore` và note để fix sau  

---

**Câu 7.** [📈 Scale] Next.js app bundle size 2MB (gzipped). FCP = 4s trên 4G. Highest-impact optimization?

A. Bật SSR cho tất cả pages  
B. Minify và compress CSS files  
C. Upgrade Next.js lên version mới nhất  
D. Dynamic import cho heavy libraries (chart, rich text editor); analyze bundle với `@next/bundle-analyzer`  

---

**Câu 8.** [Git] Team 10 người, feature branches tồn tại 2-3 tuần, merge conflicts lớn cuối sprint. Cách cải thiện vấn đề merge conflict?

A. Mỗi developer được assign file riêng để edit  
B. Merge main vào feature branch hàng ngày; merge feature vào main ngay khi done thay vì chờ cuối sprint  
C. Dùng git submodule để tách feature code  
D. Merge tất cả feature branches vào main cùng lúc cuối sprint  

---

**Câu 9.** [🔒 Race condition - DB] Logs cho thấy `ERROR: deadlock detected` vài lần/ngày trong peak hours. Phân tích: T1 update `orders` rồi `payments`; T2 update `payments` rồi `orders`. Fix đúng?

A. Tăng lock timeout để transactions chờ lâu hơn trước khi deadlock  
B. Dùng SERIALIZABLE isolation cho toàn bộ DB  
C. Đảm bảo tất cả transactions update tables theo cùng thứ tự: luôn `orders` trước `payments`  
D. Chỉ thêm retry logic cho deadlock error ở application layer  

---

**Câu 10.** [🐛 Debugging - React] Dashboard có 50 widgets, mỗi widget tự fetch API riêng. Page load = 8 giây do 50 concurrent API calls. Highest-impact fix?

A. Batch API: tạo endpoint `/api/dashboard` trả về tất cả data trong 1 request; hoặc parallel fetch với Promise.all thay vì sequential  
B. Lazy load tất cả widgets — load khi scroll  
C. Thêm React Query để cache responses  
D. Chuyển sang SSR để server pre-fetch data  

---

**Câu 11.** [🐛 Debugging - PostgreSQL] Sau khi thêm index trên `users.email`, query `WHERE email ILIKE '%@gmail.com'` vẫn dùng Seq Scan. Tại sao?

A. Index chưa được rebuild sau khi tạo (`REINDEX` cần chạy)  
B. Email column cần UNIQUE index thay vì regular index  
C. Quá nhiều NULL values trong column làm index không hiệu quả  
D. Leading wildcard `%@gmail.com` không dùng được B-tree index — cần `pg_trgm` extension với GIN index  

---

**Câu 12.** [💥 Failure] Deploy mới lên production, error rate tăng từ 0.1% lên 18% trong 5 phút. Thứ tự xử lý theo rollback-first principle?

A. Hotfix ngay trên production, debug live với production data  
B. Rollback về version trước ngay để restore service; sau đó investigate và fix trong staging  
C. Scale thêm instances để absorb errors  
D. Enable maintenance mode và thông báo cho users  

---

**Câu 13.** [💥 Failure - Security] Developer vô tình commit AWS API key vào git repo (private). Repo đã được clone bởi 5 người. Bước QUAN TRỌNG NHẤT đầu tiên?

A. Xóa commit bằng `git rebase` và force push để clean history  
B. Thêm `.gitignore` rule để prevent tương lai  
C. Revoke và rotate API key ngay lập tức — đây là priority #1, cleanup git history là thứ yếu  
D. Xóa toàn bộ git history và khởi tạo lại repo  

---

**Câu 14.** [📈 Scale] App Node.js với async/await, database bị chậm tạm thời. Server không nhận được request mới dù CPU thấp và event loop không bị block. Nguyên nhân?

A. async/await vẫn block event loop trong một số trường hợp  
B. Quá nhiều requests đang `await` DB query cùng lúc → exhausted connection pool, requests mới phải queue chờ  
C. Node.js không handle tốt concurrent async operations  
D. Database driver bị bug khi kết hợp với async mode  

---

**Câu 15.** [🐛 Debugging - Docker] 2 containers trong cùng Docker Compose network không thể kết nối với nhau qua `localhost`. Nguyên nhân?

A. Trong Docker network, mỗi container có network namespace riêng — phải dùng service name (trong docker-compose.yml) thay vì localhost  
B. Docker Compose network mặc định là host mode  
C. Phải explicitly `expose` ports giữa containers trong docker-compose.yml  
D. Containers phải dùng cùng Docker image thì mới communicate được  

---

### Part 2: Answer Key

| Câu | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 |
|-----|---|---|---|---|---|---|---|---|---|----|----|----|----|----|-----|
| Đáp án | **B** | **A** | **D** | **C** | **A** | **B** | **D** | **B** | **C** | **A** | **D** | **B** | **C** | **B** | **A** |

> **Ghi chú phân loại:** Câu 5 — ứng viên không biết in-memory cache per-instance là blind spot về distributed systems. Câu 13 — ứng viên ưu tiên git cleanup trước khi rotate key là red flag về security mindset.

---

### Part 3: Essay Question 1 – System Design

**Đề bài:**

Thiết kế schema database cho hệ thống chat real-time kiểu Slack: workspaces, channels (public/private), messages, threads, reactions, members với roles. Viết ra các bảng chính, quan hệ, và index quan trọng. Không cần SQL đầy đủ.

**Hướng trả lời:**

- **Tables:** `workspaces`, `users`, `workspace_members(workspace_id, user_id, role)`, `channels(workspace_id, type, name)`, `channel_members`, `messages(channel_id, user_id, content, parent_message_id, created_at)`, `reactions(message_id, user_id, emoji)`
- **Thread:** `parent_message_id` trên messages table — self-referential FK; thread = messages WHERE parent_message_id = X
- **Indexes quan trọng:**
  - `messages(channel_id, created_at DESC)` — load chat history theo channel
  - `messages(parent_message_id)` — load thread replies
  - `channel_members(user_id, channel_id)` — check access permission
  - `reactions(message_id)` — load reactions cho message
- **Pagination:** Cursor-based trên `created_at + id`, không dùng OFFSET (chậm khi data lớn)
- **Soft delete:** `deleted_at` thay vì DELETE thật — giữ thread integrity
- **Tradeoff cần nhắc:** Với 1M+ messages/channel, cân nhắc archive/partition theo tháng

---

### Part 4: Essay Question 2 – Incident / Debug

**Đề bài:**

Background job "monthly-report" chạy ổn 6 tháng. Tháng này đột ngột timeout sau 30 phút (timeout limit là 30 phút). Dữ liệu trong DB tăng bình thường (~10% mỗi tháng). Không có code change. Mô tả quy trình điều tra incident này.

**Hướng trả lời:**

- **Bước 1 — Reproduce an toàn:** Chạy job trong staging với production data dump (hoặc subset), đo thời gian
- **Bước 2 — Profile query:** Thêm query timing logging, tìm query nào chiếm thời gian nhiều nhất
- **Bước 3 — EXPLAIN ANALYZE** trên slow queries — tìm Seq Scan bất thường
- **Root cause khả dĩ:**
  - Query plan thay đổi do stale statistics (data tăng 10% × 6 tháng = 60% → planner chọn sai strategy) — fix: `ANALYZE`
  - Index bloat sau nhiều UPDATE/DELETE — fix: `REINDEX CONCURRENTLY`
  - Memory spill: query từng fit trong `work_mem`, giờ thì không → spill ra disk
  - Một table liên quan tăng đột biến (e.g. audit_log không có cleanup)
- **Fix:** ANALYZE + xem xét tăng `work_mem` cho job này; partition table nếu cần; thêm monitoring/alerting cho job duration

---
---

## 🧪 TEST SET 3

### Part 1: Multiple Choice (15 câu)

**Câu 1.** [🔒 Race condition - Webhook] Payment gateway gửi `payment.success` cho order #123. Hệ thống update order PAID và tặng 100 reward points. 10 phút sau gateway gửi lại (retry). User bị tặng points 2 lần. Fix?

A. Ignore webhooks đến trong 10 phút gần nhất từ cùng IP  
B. Dùng `IF NOT EXISTS` khi insert reward points record  
C. Lưu `webhook_event_id` vào DB với unique constraint, check trước khi process — đã tồn tại thì return 200 ngay  
D. Xử lý webhooks synchronously để gateway không retry  

---

**Câu 2.** [🐛 Debugging - PostgreSQL] Query `WHERE title ILIKE '%laptop%'` trên 10M rows: EXPLAIN cho thấy Seq Scan dù có index trên `title`. Đây có phải lỗi không?

A. Không phải lỗi — leading wildcard `%laptop%` không dùng được B-tree index; Seq Scan đúng; cần `pg_trgm` GIN index để fix  
B. Cần REINDEX để rebuild index bị corrupt  
C. Phải thêm `LIMIT` vào query để force index usage  
D. Index trên `title` sai type — cần HASH index thay vì B-tree  

---

**Câu 3.** [🐛 Debugging - React] React 17: user submit form, state `isLoading = false` và `data = response` được set cùng lúc nhưng component log cho thấy 2 re-renders. React 18 thì chỉ 1. Giải thích?

A. 2 setState calls luôn gây 2 re-renders bất kể React version  
B. React 17 không batch setState trong async callbacks (setTimeout, promise handlers) — mỗi setState gây 1 render; React 18 tự động batch tất cả  
C. Form submit event gây 2 synthetic events chồng nhau  
D. `useEffect` chạy sau mỗi setState gây thêm 1 render  

---

**Câu 4.** [🐛 Debugging - Query Plan] Query ổn định 6 tháng nay, đột nhiên chậm 10x không có code change. Table size không thay đổi nhiều. Điều tra đầu tiên?

A. Restart PostgreSQL service để clear plan cache  
B. Tăng `work_mem` cho session  
C. Tạo thêm index mới để cover query  
D. `ANALYZE` để update statistics — planner có thể đang dùng stale stats, dẫn đến wrong execution plan  

---

**Câu 5.** [🐛 Debugging - Docker] Service A (container) gọi `http://localhost:3001` để reach Service B (container) trong Docker Compose. Connection refused. Fix?

A. Thêm `network_mode: host` cho Service A  
B. Dùng service name làm hostname: `http://service-b:3001` (Docker DNS trong Compose network)  
C. Expose port 3001 của Service B ra host machine (`ports: "3001:3001"`)  
D. Dùng container IP address trực tiếp thay vì hostname  

---

**Câu 6.** [🐛 Debugging - Next.js] Lỗi `window is not defined` khi deploy Next.js lên production. Local dev không có lỗi. Nguyên nhân?

A. Node.js version trên production server khác local  
B. Environment variable `NEXT_PUBLIC_*` chưa được set trên production  
C. Component access `window` object nhưng chạy trên server (SSR/SSG) — không có `window` trong Node.js runtime  
D. Production build mode khác development mode về cách handle global objects  

---

**Câu 7.** [📈 Scale - K8s] Rolling deploy với Kubernetes: pod cũ bị terminate nhưng một số in-flight requests bị dropped (502 errors từ users). Fix?

A. Implement graceful shutdown: khi nhận SIGTERM, stop nhận request mới, drain in-flight requests, thêm `preStop: sleep 5` để LB kịp unhealthy pod  
B. Chỉ tăng `terminationGracePeriodSeconds` là đủ  
C. Set `maxUnavailable: 0` trong rolling update strategy  
D. Switch sang Blue-Green deployment thay vì Rolling  

---

**Câu 8.** [⚖️ Trade-off] Team 8 người, feature branches tồn tại 2-3 tuần, integration hell mỗi sprint. Solution nào scalable nhất về mặt team workflow?

A. Tất cả commit thẳng vào main, không dùng feature branch  
B. Tăng sprint length lên 4 tuần để có thêm time cho integration  
C. Dùng git submodule để tách feature code riêng biệt  
D. Feature flags + short-lived branches: merge code sớm vào main với feature flag OFF — tránh long-lived branches  

---

**Câu 9.** [🔒 Race condition] E-commerce: `stock = 5`, 10 users checkout cùng lúc. Sau đó `stock = -3`. Fix ở database layer?

A. Application-level mutex: chỉ 1 request vào checkout handler cùng lúc  
B. `UPDATE products SET stock = stock - 1 WHERE id = X AND stock > 0` — atomic, check `affected_rows` = 0 nghĩa là sold out  
C. SERIALIZABLE isolation cho tất cả checkout transactions  
D. Queue tất cả checkout requests, process tuần tự  

---

**Câu 10.** [⚖️ Trade-off] API `/api/users/me` được gọi mỗi authenticated request để verify user. DB query: 50ms × 1.000 req/s = 50.000 queries/phút. Fix?

A. Tăng database server hardware  
B. Tạo index trên `users.token` column  
C. Cache user session/token result trong Redis (TTL 5 phút) — giảm DB load xuống tỉ lệ cache miss  
D. Dùng in-memory LRU cache trong Node.js process (bị phân tán khi multi-instance)  

---

**Câu 11.** [🐛 TypeScript] Function signature: `function parse(input: string): User`. Developer gọi `parse(null)`, TypeScript không báo lỗi. Khi nào điều này xảy ra?

A. `strictNullChecks: false` — TypeScript coi `null` là subtype của mọi type, không check  
B. `User` type có `null` trong union type definition  
C. Developer dùng TypeScript với `--allowJs` flag  
D. Function có `@ts-ignore` annotation  

---

**Câu 12.** [💥 Failure - K8s] K8s Pod được đánh dấu `Ready` nhưng vẫn đang warm-up (DB connections chưa sẵn sàng). Traffic được route vào sớm → 500 errors. Fix?

A. Tăng `initialDelaySeconds` của liveness probe  
B. Readiness probe phải check thực sự: ping DB, ping cache — không chỉ return 200 HTTP static  
C. Dùng `startupProbe` thay readiness probe  
D. Giảm `minReadySeconds` trong Deployment spec  

---

**Câu 13.** [💥 Failure] Express route handler dùng async/await, throw error → crash toàn bộ Node.js process (unhandled rejection). Fix?

A. Wrap tất cả code trong process-level `process.on('uncaughtException')`  
B. Tăng Node.js heap size  
C. Dùng `cluster` module để auto-restart worker khi crash  
D. Mọi async handler phải có try-catch hoặc dùng wrapper `asyncHandler(fn)` để forward errors vào `next(err)`  

---

**Câu 14.** [📈 Scale - Connection] App deploy 10 K8s pods, mỗi pod connection pool = 20. PostgreSQL `max_connections = 100`. Vấn đề?

A. Không có vấn đề — connection pool tái sử dụng connections, không phải 10 × 20 connections đồng thời  
B. Cần thêm read replica để chia connections  
C. 10 × 20 = 200 > 100 — khi tất cả pods đầy pool, PostgreSQL sẽ reject connections. Cần PgBouncer pooling tầng middleware  
D. Chỉ cần tăng `max_connections` PostgreSQL lên 500  

---

**Câu 15.** [📈 Scale - Real-time] Socket.IO với 1 server: 50K concurrent connections, CPU 80%. Scale strategy?

A. Horizontal scale: thêm instances + Redis adapter pub/sub; load balancer với sticky sessions hoặc stateless auth  
B. Vertical scale: nâng server lên 32 cores  
C. Giảm heartbeat interval để server free connections nhanh hơn  
D. Switch sang HTTP/2 Server-Sent Events vì nhẹ hơn WebSocket  

---

### Part 2: Answer Key

| Câu | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 |
|-----|---|---|---|---|---|---|---|---|---|----|----|----|----|----|-----|
| Đáp án | **C** | **A** | **B** | **D** | **B** | **C** | **A** | **D** | **B** | **C** | **A** | **B** | **D** | **C** | **A** |

> **Ghi chú phân loại:** Câu 1 — ứng viên chọn B là thiếu kinh nghiệm (IF NOT EXISTS không atomic). Câu 2 — chỉ senior biết leading wildcard + pg_trgm pattern. Câu 14 — ứng viên không biết PgBouncer là common gap.

---

### Part 3: Essay Question 1 – System Design

**Đề bài:**

Thiết kế Webhook Delivery System: hệ thống gửi webhooks cho third-party customers khi có events (order created, payment success). Yêu cầu: at-least-once delivery, retry với exponential backoff, deduplication ở customer side. Không cần code, mô tả architecture và data flow.

**Hướng trả lời:**

- **Schema:** `webhook_endpoints(customer_id, url, secret, events[])`, `webhook_deliveries(event_id, endpoint_id, status, attempts, next_retry_at, payload JSONB)`
- **Flow:** Event xảy ra → insert vào `webhook_deliveries` → worker poll/consume → gửi HTTP POST → update status
- **Retry:** Exponential backoff: 30s → 5m → 30m → 2h → 24h, max 5 attempts → mark FAILED
- **Signature:** HMAC-SHA256 của payload với customer secret → customer verify để chống fake events
- **Idempotency cho customer:** Mỗi delivery có unique `event_id`, customer check đã process chưa
- **Scalability:** Queue (Bull/SQS) thay vì polling, multiple workers, per-customer rate limit
- **Monitoring:** Dashboard cho customer xem delivery history, manual retry

---

### Part 4: Essay Question 2 – Incident / Debug

**Đề bài:**

API `/api/products/search` trả về kết quả đúng nhưng p99 latency = 12 giây. Staging và local đều ổn (<200ms). Production table có 5M records. Mô tả bước điều tra từ đầu đến tìm ra nguyên nhân.

**Hướng trả lời:**

- **Bước 1:** Check APM/Datadog — latency spike bắt đầu từ khi nào? Sau deploy? Sau data milestone?
- **Bước 2:** `EXPLAIN ANALYZE` trên slow query với production data (hoặc dump) — Seq Scan hay Index Scan? Actual vs Estimated rows có chênh lệch lớn không?
- **Bước 3:** Check index usage — có index không? index được dùng không?
- **Nguyên nhân common:**
  - Full-text search dùng `ILIKE '%keyword%'` → Seq Scan → cần pg_trgm GIN index
  - Index tồn tại nhưng stale statistics → planner chọn Seq Scan vì estimate rows sai → fix: `ANALYZE`
  - Search có nhiều JOINs, data production lớn hơn staging → nested loop join không scale → cần hash join
  - Missing pagination: trả về 50K results thay vì 20
- **Fix:** Tạo đúng index type, ANALYZE, kiểm tra query có LIMIT/OFFSET chưa, có thể cần Elasticsearch nếu full-text search phức tạp

---
---

## 🧪 TEST SET 4

### Part 1: Multiple Choice (15 câu)

**Câu 1.** [🐛 Debugging - React] SPA React Router: sau khi navigate qua 20+ pages, app chậm dần và đôi khi freeze. DevTools memory tab cho thấy memory tăng liên tục. Nguyên nhân khả dĩ nhất?

A. React re-renders quá nhiều lần khi navigate giữa pages  
B. React Router không cleanup component state khi navigate away  
C. Bundle size lớn gây memory pressure khi load nhiều pages  
D. `useEffect` subscriptions (WebSocket, setInterval, event listeners) không cleanup khi component unmount  

---

**Câu 2.** [🐛 Debugging - DevOps] Build Docker image trong CI mất 15 phút, 80% thời gian là `npm install`. Optimize?

A. Dùng `node:alpine` base image thay vì `node:18` để nhỏ hơn  
B. Copy `package.json` + `package-lock.json` → `npm install` TRƯỚC khi copy source code — Docker layer cache reuse khi code thay đổi nhưng deps không đổi  
C. Multi-stage build với parallel stages  
D. Pre-build image và push lên registry, CI chỉ pull không build  

---

**Câu 3.** [🐛 Debugging - Query Plan] Query `WHERE user_id = 123 AND status = 'active'` chậm. Composite index `(user_id, status)` đã tồn tại nhưng EXPLAIN cho thấy Index Scan trên index `(user_id)` đơn lẻ, rồi filter `status`. Tại sao composite index không được dùng?

A. Query planner dùng stale statistics, ước tính wrong selectivity — `ANALYZE` sẽ fix  
B. Composite index column order sai: phải là `(status, user_id)` thay vì `(user_id, status)`  
C. `status` có quá nhiều NULL values làm index không effective  
D. PostgreSQL cần `SET enable_indexscan = on` để dùng composite index  

---

**Câu 4.** [🐛 Debugging - CORS] Frontend React (localhost:3000) gọi API Node.js (localhost:4000). Postman thành công, browser báo CORS error. Nguyên nhân?

A. Node.js dev server không hỗ trợ CORS cho localhost  
B. React dev server block cross-origin requests tự động  
C. API server thiếu CORS headers (`Access-Control-Allow-Origin`) — browser enforce CORS, Postman bỏ qua  
D. Port 3000 và 4000 phải trùng nhau mới CORS OK  

---

**Câu 5.** [⚖️ Trade-off - Migration] Migration thêm column `NOT NULL DEFAULT 'value'` vào bảng 20M rows. Staging chạy 2 giây, production chạy 8 phút và lock table. Nguyên nhân chênh lệch?

A. Staging có ít migrations trong history hơn  
B. Staging có ít data hơn — trên bảng lớn, `ALTER TABLE ADD COLUMN NOT NULL DEFAULT` (với non-constant default) buộc PostgreSQL rewrite toàn bộ table; PostgreSQL 11+ fix với DEFAULT constant nhưng phụ thuộc version  
C. Production DB có nhiều concurrent connections active hơn  
D. Production dùng PostgreSQL version khác staging  

---

**Câu 6.** [🐛 Debugging - Next.js] Next.js app: hydration mismatch warning, `Text content did not match`. Chỉ xảy ra lần đầu load page. Nguyên nhân phổ biến nhất?

A. Server và client dùng khác web font gây layout shift  
B. HTML element nesting không đúng (e.g. div trong p)  
C. JavaScript bundle load chậm hơn SSR HTML  
D. Component render `Date.now()`, `Math.random()` hoặc browser-only value — server và client cho kết quả khác nhau  

---

**Câu 7.** [🐛 Debugging - Rate Limiting] Rate limiter Fixed Window: 1.000 req/phút. User gửi 999 req lúc 12:00:59, rồi 999 req lúc 12:01:01. Tổng trong 2 giây: 1.998 req, không bị block. Vấn đề gì?

A. Fixed Window boundary burst — 2 windows liền kề cho phép 2x rate limit tại ranh giới; Sliding Window counter fix được  
B. Rate limiter config sai, phải dùng 100 req/6s  
C. Behavior đúng, không phải bug — rate limit tính theo phút  
D. Token bucket còn tệ hơn Fixed Window trong trường hợp này  

---

**Câu 8.** [⚖️ Trade-off] Analytics dashboard cần refresh data mỗi 30 giây. Team debate: polling vs WebSocket. Data không cần real-time, chỉ periodic. Kết luận?

A. WebSocket luôn tốt hơn polling vì persistent connection  
B. Polling (setInterval 30s) đủ tốt và đơn giản hơn — WebSocket overhead không justify cho interval 30s  
C. SSE (Server-Sent Events) là bắt buộc trong trường hợp này  
D. Phải dùng WebSocket vì server cần push data  

---

**Câu 9.** [🔒 Security] App lưu refresh token vào `localStorage`. Security review báo đây là risk. Tại sao và fix?

A. localStorage không hỗ trợ token với size > 5KB  
B. localStorage bị xóa khi user đóng tab, token mất  
C. localStorage accessible bằng JavaScript → XSS attack có thể steal token; fix: dùng `HttpOnly` cookie — không accessible qua JS  
D. localStorage không có encryption tự động  

---

**Câu 10.** [🐛 Debugging - DB Locks] Trong peak hours, thỉnh thoảng có requests pending 30s+ dù query bình thường 20ms. Logs báo lock wait timeout. Bước điều tra?

A. Tăng PostgreSQL connection pool size  
B. Check disk I/O — có thể bottleneck  
C. Thêm index để reduce query time  
D. Query `pg_locks JOIN pg_stat_activity` để tìm blocking query; long-running transaction giữ lock trong khi queue chờ  

---

**Câu 11.** [🐛 Debugging - React] `React.memo()` không prevent re-render dù parent component truyền `handleSubmit` function. Fix?

A. Wrap `handleSubmit` trong `useCallback` ở parent — tránh tạo mới function reference mỗi render  
B. Move `handleSubmit` xuống child component  
C. Dùng `useRef` để store handleSubmit  
D. Dùng `useMemo` thay vì `useCallback` cho functions  

---

**Câu 12.** [🐛 Debugging - CI] Tests pass trên Mac M1 (local) nhưng fail trên CI Ubuntu x86. Tests liên quan đến file import paths. Nguyên nhân?

A. Mac và Ubuntu dùng khác Node.js runtime internals  
B. npm packages không tương thích cross-platform  
C. macOS filesystem case-insensitive (`import './File'` = `import './file'`), Ubuntu case-sensitive — import sai case không phát hiện được trên Mac  
D. GitHub Actions Ubuntu có bug với TypeScript compilation  

---

**Câu 13.** [📈 Scale] App Node.js scale từ 1 lên 10 instances. Tính năng nào BẮT BUỘC phải refactor TRƯỚC khi scale?

A. Database connection pool size  
B. In-memory session store, in-memory cache, WebSocket state — tất cả phải move sang shared store (Redis) vì mỗi instance có memory riêng  
C. API response format  
D. Logging và monitoring setup  

---

**Câu 14.** [⚖️ Trade-off - API Design] Mobile app cần 3 fields từ User object, web app cần 20 fields khác. Endpoint `/api/user-dashboard` hiện trả về 50+ fields cho cả 2. Over-fetching rõ ràng. Giải pháp phù hợp nhất cho team nhỏ?

A. Tạo 2 endpoints: `/api/user-dashboard/mobile` và `/api/user-dashboard/web`  
B. Thêm `?fields=field1,field2` query parameter để client chọn fields  
C. Migrate toàn bộ API sang GraphQL  
D. BFF (Backend for Frontend): dedicated thin API layer cho từng client — ít overhead hơn GraphQL, flexible hơn single endpoint  

---

**Câu 15.** [🐛 Debugging - Query Join] EXPLAIN cho thấy `Hash Join` giữa bảng A (10K rows, có index) và B (10M rows, có index trên `a_id`). Query chậm. Sau `ANALYZE`, planner chuyển sang `Nested Loop`. Điều này nói lên gì?

A. Hash Join luôn kém hơn Nested Loop  
B. B-tree index trên `B.a_id` bị corrupt  
C. Stale statistics khiến planner underestimate số rows của A → chọn sai join algorithm; sau ANALYZE thì chọn đúng  
D. Cần tạo materialized view từ kết quả join này  

---

### Part 2: Answer Key

| Câu | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 |
|-----|---|---|---|---|---|---|---|---|---|----|----|----|----|----|-----|
| Đáp án | **D** | **B** | **A** | **C** | **B** | **D** | **A** | **B** | **C** | **D** | **A** | **C** | **B** | **D** | **C** |

> **Ghi chú phân loại:** Câu 7 — ứng viên không biết Fixed Window boundary problem là thiếu depth về rate limiting. Câu 10 — ứng viên không biết `pg_locks` query là thiếu production DB experience. Câu 13 — không biết in-memory state issue là red flag cho horizontal scaling.

---

### Part 3: Essay Question 1 – System Design

**Đề bài:**

Thiết kế JWT + Refresh Token authentication system cho 500K concurrent users. Yêu cầu: access token short-lived (15 phút), refresh token long-lived (30 ngày), support logout tất cả devices, detect token reuse (refresh token rotation). Mô tả flow và các vấn đề cần handle.

**Hướng trả lời:**

- **Flow:** Login → issue `access_token` (JWT 15m) + `refresh_token` (opaque, 30d, lưu DB) → client dùng access_token gọi API → hết hạn thì gọi `/refresh` với refresh_token → issue access_token mới + refresh_token mới (rotation) → invalidate refresh_token cũ
- **Refresh token rotation:** Mỗi refresh token chỉ dùng được 1 lần — nếu bị steal và attacker dùng trước user, user sẽ nhận lỗi → alert và revoke tất cả tokens của user
- **Logout tất cả devices:** Thêm `user_token_version` counter vào user record, increment khi logout-all; access token chứa version, server check mỗi request
- **Storage:** Access token trong memory (JS variable), refresh token trong `HttpOnly` Secure cookie
- **Scale:** Access token verify là stateless (chỉ verify JWT signature) → không cần DB lookup mỗi request → 500K concurrent không vấn đề gì
- **DB cho refresh tokens:** Table `refresh_tokens(token_hash, user_id, expires_at, revoked_at)` — index trên `token_hash`

---

### Part 4: Essay Question 2 – Database

**Đề bài:**

Column `users.username` (VARCHAR, nullable) cần đổi thành `users.handle` (VARCHAR, NOT NULL, UNIQUE). Bảng có 20M rows, production 24/7, không được có downtime. Viết migration plan từng bước.

**Hướng trả lời:**

- **Tại sao không làm 1 bước:** ALTER TABLE RENAME COLUMN + ADD NOT NULL + ADD UNIQUE trên 20M rows sẽ lock table → downtime
- **Bước 1 (migration):** `ADD COLUMN handle VARCHAR` (nullable, no constraint) — PostgreSQL không rewrite table
- **Bước 2 (code):** Deploy code mới đọc từ `handle` nếu có, fallback về `username`; write vào cả 2 columns
- **Bước 3 (backfill):** Background job: batch UPDATE `handle = username WHERE handle IS NULL` (theo 1.000 rows/batch với `pg_sleep` để tránh lock lâu)
- **Bước 4:** Sau khi backfill 100%: `CREATE UNIQUE INDEX CONCURRENTLY idx_users_handle ON users(handle)` — không lock
- **Bước 5:** `ALTER TABLE users ALTER COLUMN handle SET NOT NULL` — PostgreSQL 12+ có thể làm không lock nếu đã check constraint
- **Bước 6:** Drop column `username` sau khi code đã remove mọi reference
- **Rollback plan:** Ở mỗi bước đều có thể rollback vì code tương thích backward

---
---

## 🧪 TEST SET 5

### Part 1: Multiple Choice (15 câu)

**Câu 1.** [🐛 Debugging - PostgreSQL] 6 tháng trước: query `SELECT * FROM analytics WHERE date = CURRENT_DATE` chạy 50ms. Nay: 8s. Table tăng từ 1M lên 50M rows, index trên `date` vẫn còn. Điều tra đầu tiên?

A. `REINDEX CONCURRENTLY` để rebuild index + `ANALYZE` để update statistics — index có thể bloated, planner dùng stale stats  
B. Index `date` không còn selective vì tất cả rows đều có date  
C. Query cần rewrite với CTEs để optimize  
D. Upgrade PostgreSQL version để tận dụng query optimizer mới  

---

**Câu 2.** [🐛 Debugging - React Context] App dùng 1 Context object chứa `user`, `theme`, `cart`, `notifications`. Khi notification mới đến, toàn bộ app re-render kể cả những component không dùng notifications. Fix?

A. `React.memo()` trên tất cả components trong app  
B. Chuyển toàn bộ sang Redux Toolkit  
C. Split thành nhiều Contexts theo domain — component chỉ subscribe Context mà nó dùng, notification update không trigger re-render cart components  
D. `useMemo()` trên Context value  

---

**Câu 3.** [💥 Failure - Microservices] Service A gọi Service B synchronously (HTTP). Service B đột ngột slow (response 3s). Hệ quả với Service A và fix pattern?

A. Service A tự động timeout và retry với exponential backoff  
B. Service A bị chậm theo — resources bị giữ chờ response; nếu B down thì A cũng fail (cascade failure). Fix: circuit breaker + timeout + async pattern  
C. Service A tự động cache response của B khi B slow  
D. Chỉ requests đang active bị ảnh hưởng, throughput mới không bị impact  

---

**Câu 4.** [⚖️ Trade-off - DB Schema] Bảng `user_settings` có 80 boolean columns (`enable_dark_mode`, `enable_notifications`...). Team muốn thêm 50 settings mới. Vấn đề của approach này?

A. PostgreSQL có giới hạn cứng 250 columns  
B. Boolean columns tốn rất nhiều disk space  
C. Query performance tệ khi có quá nhiều columns  
D. Schema cứng: thêm feature = ALTER TABLE (lock/deploy risk); khó query linh hoạt. Better: `(user_id, setting_name, value)` EAV hoặc JSONB column  

---

**Câu 5.** [🐛 Debugging] Một số users báo checkout timeout sau 30s. Server logs không thấy error. Database OK. Nguyên nhân khả dĩ nhất?

A. Server response size quá lớn gây network timeout  
B. External payment gateway call không có timeout config — request hang đến khi load balancer 30s timeout kill connection; cần set explicit timeout cho external calls  
C. Node.js single-threaded xử lý quá lâu cho 1 request  
D. SSL handshake timeout với payment gateway  

---

**Câu 6.** [⚖️ Trade-off - Git] Developer rebase `feature/payments` (2 tuần develop) lên `main`. Rủi ro lớn nhất?

A. Rebase viết lại commit history — nếu branch đã push lên remote và người khác đang dùng, force push sẽ gây conflict và mất work của họ  
B. Rebase có thể merge code từ sai branch  
C. Rebase không giữ lại commit timestamps gốc  
D. Rebase không compatible với PR workflow trên GitHub  

---

**Câu 7.** [🐛 Debugging] App Node.js tạo new DB connection mỗi request. 10 req/s OK. 100 req/s → PostgreSQL báo `too many connections`. Root cause?

A. PostgreSQL default `max_connections = 10`  
B. Node.js event loop không handle 100 concurrent connections  
C. Mỗi request tạo 1 connection → overhead khởi tạo + PostgreSQL memory per connection; cần `pg-pool` để reuse connections  
D. Network bandwidth giữa app và DB bị saturated  

---

**Câu 8.** [🐛 Debugging - Next.js] Page import `chart.js` (500KB gzipped). Chart chỉ hiển thị khi user click. FCP chậm vì bundle lớn. Fix?

A. Dùng lighter charting library (recharts, victory)  
B. `dynamic(() => import('chart.js'), { ssr: false })` — chỉ load JS bundle khi component mount, không block FCP  
C. Pre-load chart.js với `<link rel="preload">` để faster khi cần  
D. Server-render chart thành SVG static  

---

**Câu 9.** [🔒 Race condition - Distributed] Order service (Postgres) và Inventory service (MySQL) cần update atomically: tạo order VÀ giảm stock. Approach phù hợp nhất cho microservices?

A. XA distributed transactions — chuẩn và đảm bảo ACID  
B. 2-Phase Commit (2PC) — strong consistency  
C. Application-level try-catch với manual rollback  
D. Saga pattern với compensating transactions — practical, decoupled, không cần distributed lock  

---

**Câu 10.** [🐛 Debugging - Cache] Cache được populate lazy (lần đầu request). Sau deploy, cache trống. 10.000 users vào cùng lúc → tất cả cache miss → DB quá tải. Vấn đề này gọi là gì và fix?

A. Cache stampede / thundering herd — fix: cache warming trước deploy, hoặc mutex locking (chỉ 1 request populate, còn lại wait/retry), hoặc probabilistic early expiry  
B. Cache invalidation bug — cần xóa cache thủ công  
C. DB connection pool quá nhỏ  
D. Lazy caching không phù hợp với production  

---

**Câu 11.** [🐛 TypeScript] `function getFirst<T>(arr: T[]): T | undefined` được gọi với `getFirst([])`. Developer expect `never` nhưng TypeScript trả về `unknown`. Để fix type inference phải làm gì?

A. Thêm overload signature cho empty array case  
B. Sử dụng `as const` khi gọi function  
C. Gọi với explicit type: `getFirst<User>([])` để TypeScript biết T là User  
D. Return type phải là `T | null` thay vì `T | undefined`  

---

**Câu 12.** [🐛 Debugging - Production Bug] Production: 1/1.000 requests trả về data của user khác. Cực kỳ hiếm, không reproduce được. Approach điều tra?

A. Thêm logging vào tất cả route handlers  
B. Restart server để clear bất kỳ memory corruption  
C. Rollback về version trước  
D. Nghi ngờ shared mutable state giữa requests — tìm global variables hoặc shared objects bị mutate trong async context; đây là classic async context leakage trong Node.js  

---

**Câu 13.** [⚖️ Trade-off - Testing] 10% CI runs fail với timeout errors không liên quan đến code changes (pass khi retry). Cách handle đúng?

A. Tests đang test wrong behavior — cần rewrite hoàn toàn  
B. Flaky tests — root cause: race condition trong test setup, external service dependency, timing-based assertions. Phải fix nguyên nhân, không nên retry blindly  
C. Upgrade CI runner hardware để ổn định hơn  
D. Tăng test timeout lên 2x để có buffer  

---

**Câu 14.** [🐛 Debugging - DB Performance] INSERT performance trên bảng `transactions` giảm 40% trong 6 tháng. Data tăng bình thường. Bảng có 8 indexes. Nguyên nhân likely nhất?

A. Mỗi INSERT phải update tất cả 8 indexes — quá nhiều index maintenance overhead; review và drop unused indexes  
B. Table cần PARTITION theo tháng để giảm size  
C. PostgreSQL không optimize INSERTs trên bảng có nhiều indexes  
D. Cần thêm index để speed up INSERTs bằng cách avoid sequential scan  

---

**Câu 15.** [💥 Failure - K8s] Pod Java Spring Boot: memory limit `256Mi`, JVM default heap có thể lên tới 512MB. Pod OOMKilled liên tục. Fix đúng?

A. Tăng limit lên 1Gi mà không tune JVM  
B. Switch từ Java sang Node.js để giảm memory footprint  
C. Set explicit JVM flags: `-Xmx180m -Xms180m` để fit trong container limit (giữ ~60MB cho non-heap: Metaspace, thread stacks)  
D. Dùng K8s HPA để auto-scale khi memory cao  

---

### Part 2: Answer Key

| Câu | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 |
|-----|---|---|---|---|---|---|---|---|---|----|----|----|----|----|-----|
| Đáp án | **A** | **C** | **B** | **D** | **B** | **A** | **C** | **B** | **D** | **A** | **C** | **D** | **B** | **A** | **C** |

> **Ghi chú phân loại:** Câu 3 — ứng viên không nhắc circuit breaker là thiếu reliability patterns. Câu 9 — ứng viên chọn 2PC là mid-level thinking (impractical); chọn Saga là senior. Câu 12 — không biết async context leakage là không có production debugging experience.

---

### Part 3: Essay Question 1 – System Design

**Đề bài:**

Thiết kế Real-time Leaderboard cho mobile game với 10 triệu players. Yêu cầu: hiển thị top 100 global, rank của user hiện tại, update real-time khi score thay đổi. Throughput: 1.000 score updates/giây. Không cần code.

**Hướng trả lời:**

- **Redis Sorted Set:** `ZADD leaderboard <score> <user_id>` — O(log N) insert; `ZRANGE leaderboard 0 99 WITHSCORES REV` để lấy top 100; `ZREVRANK leaderboard <user_id>` để lấy rank của 1 user
- **Write flow:** Score update → Redis ZADD (immediate) + async write-through vào PostgreSQL (durability)
- **Read flow:** Top 100 → từ Redis cache (fast); user rank → ZREVRANK (O(log N))
- **Real-time push:** Sau mỗi score update, check nếu user vào/ra top 100 → push notification qua WebSocket/SSE đến subscribed clients
- **Scale 10M users, 1.000 updates/s:** Redis single node xử lý được; nếu cần scale → Redis Cluster hoặc separate Sorted Set per region
- **Durability:** Redis RDB/AOF persistence + PostgreSQL as source of truth; recover leaderboard từ PostgreSQL nếu Redis crash

---

### Part 4: Essay Question 2 – Incident / Debug

**Đề bài:**

Sau khi team migrate sang microservices, p99 latency toàn hệ thống tăng từ 200ms lên 2s. Một request đến API gateway đi qua 5-6 services. Không rõ service nào là nguyên nhân. Mô tả approach điều tra.

**Hướng trả lời:**

- **Bước 1 — Distributed Tracing:** Nếu chưa có, implement Jaeger/OpenTelemetry ngay — trace toàn bộ request journey qua các services với timing
- **Bước 2 — Identify bottleneck:** Nhìn vào trace waterfall — service nào chiếm nhiều thời gian nhất? Sequential hay parallel calls?
- **Bước 3 — Common causes trong microservices:**
  - **Chatty services:** Service A gọi B 10 lần trong 1 request → gộp lại hoặc batch
  - **Sequential khi có thể parallel:** 3 services được gọi tuần tự nhưng độc lập → gọi song song với Promise.all
  - **N+1 qua service boundary:** Service A gọi Service B N lần trong vòng lặp → N calls thay vì 1 batch call
  - **Cold start / connection overhead:** Mỗi inter-service call tạo mới connection → connection pool, keep-alive
  - **Serialization overhead:** JSON parse/stringify lớn → xem xét Protobuf hoặc giảm payload size
- **Fix theo priority:** Parallel calls first (easy win), sau đó N+1, sau đó caching at service boundary

---

## 📊 RUBRIC PHÂN LOẠI ỨNG VIÊN

| Score MCQ | Profile |
|-----------|---------|
| < 40% | Reject — kiến thức cơ bản chưa đủ |
| 40–55% | Junior giả mid — biết lý thuyết nhưng thiếu production experience |
| 55–70% | Mid-level thật — làm được, cần mentor với complex scenarios |
| 70–85% | Strong mid / junior senior — production-minded, có system thinking |
| > 85% | Senior candidate — cần verify qua essay và system design discussion |

**Dấu hiệu Senior thật (không phân biệt được từ MCQ score):**
- Essay: chủ động đặt câu hỏi về constraints trước khi design
- Biết khi nào trade-off không có đáp án đúng
- Nhắc đến monitoring, alerting, rollback trong mọi design

**Red flags dù MCQ score cao:**
- Không biết distributed systems basics (replication lag, connection pool)
- Không có failure/fallback mindset trong essay
- Design không đề cập đến scalability hoặc operational concerns
