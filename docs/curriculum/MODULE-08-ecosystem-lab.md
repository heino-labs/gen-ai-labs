- **Mục tiêu module:** Đưa tool vào **AI Testing Lab** theo **Problem → Tool giải quyết gì → Khi nào không dùng** — không học từng tool như khoá riêng.
- **Vì sao cần:** Học viên đã có Playwright + AI workflow. Cần bản đồ ecosystem để không bị marketing tool dẫn dắt.
- **Spiral:** AI+Automation → so sánh vendor & **Agent vs Automation cố định**.
- **Case:** Checkout · Playwright = baseline so sánh
- **Vận hành:** Chọn trước 1–2 lab **hands-on** (trial); còn lại **demo/quan sát**. Ghi rõ trong README lab.

---

## LESSON 8.1 — Lab A: Applitools (Visual AI)

### 1. PROBLEM
Functional Playwright **pass** nhưng UI Checkout lệch layout/nút — user vẫn fail trải nghiệm.

### 2. WHY IT MATTERS
Assert text/URL không bắt hết lỗi visual.

### 3. MINIMUM THEORY
**Visual AI** = so ảnh UI với baseline, bắt lệch visual. Không thay functional test.

### 4. DIAGRAM

```text
Playwright functional pass
        ↓
   Visual check (Applitools)
        ↓
   Diff vs baseline → Accept / Reject
```

| Playwright assertion | + Applitools |
|---|---|
| Đúng nghiệp vụ/DOM | Bắt lệch giao diện |

### 5. LIVE DEMO
(Demo/video hoặc trial) chạy 1 checkpoint trang Checkout.

### 6. GUIDED PRACTICE
Checklist: lỗi nào chỉ visual bắt được?

### 7. REAL TASK
`/lab/A-applitools.md` — Problem, When to use, When not, So với Playwright.

### 8. VALIDATE
Không kết luận “thay được functional” · có ≥1 ví dụ lỗi visual · có chi phí/baseline note

### 9. MEASURE
Thời gian review UI thủ công vs visual diff (ước lượng OK nếu không có license)

### 10. DOCUMENT & REUSE
Lab sheet → ecosystem map.

---

## LESSON 8.2 — Lab B: mabl

### 1. PROBLEM
Cần tạo/maintain E2E nhanh hơn với đội ít người viết code.

### 2. WHY IT MATTERS
Hiểu trade-off low-code cloud vs Playwright in-repo.

### 3. MINIMUM THEORY
mabl = platform auto-test hướng AI-assisted authoring/maintenance (mức khái niệm lab).

### 4. DIAGRAM

| mabl | Playwright (suite M6/7) |
|---|---|
| Nhanh authoring, vendor lock, ít kiểm soát code | Code-first, Git review, kiểm soát cao |

```text
Cùng user journey Checkout → so effort tạo · maintain · CI · ownership
```

### 5–7. DEMO / GUIDED / REAL
Quan sát/trial ngắn → `/lab/B-mabl.md` (bảng so sánh bắt buộc).

### 8. VALIDATE
Bảng 2 cột đủ · nêu 1 tình huống chọn mabl · 1 tình huống giữ Playwright

### 9. MEASURE
Ước lượng thời gian tạo 1 flow (nếu trial được)

### 10. DOCUMENT & REUSE
→ map.

---

## LESSON 8.3 — Lab C: Testim

### 1. PROBLEM
Low-code + AI authoring/maintenance — khác gì mabl trên slide marketing?

### 2. WHY IT MATTERS
Học viên cần tiêu chí đánh giá tool, không nhớ tên.

### 3. MINIMUM THEORY
Tiêu chí: authoring, locators smart, maintain, tích hợp CI, export/control, giá, fit team skill.

### 4. DIAGRAM
Cây quyết định:

```text
Team có engineer viết code ổn?
  ├─ Có → ưu tiên Playwright (+AI M7)
  └─ Không / cần tốc độ record
        → đánh giá Testim/mabl theo tiêu chí
```

### 5–7. DEMO / GUIDED / REAL
`/lab/C-testim.md` — chấm điểm tiêu chí 1–5 cho Checkout team giả định.

### 8. VALIDATE
Có rubric · không “tool X tốt nhất” chung chung

### 9. MEASURE
Thời gian đánh giá tool theo rubric

### 10. DOCUMENT & REUSE
Rubric dùng cho Lab D.

---

## LESSON 8.4 — Lab D: Functionize

### 1. PROBLEM
Vendor nhận “AI-driven generation/maintenance” — cần tách claim vs nhu cầu Checkout.

### 2. WHY IT MATTERS
Tránh mua tool vì demo đẹp.

### 3. MINIMUM THEORY
Nhìn Problem: gen test từ req? self-heal? ai sở hữu artifact?

### 4. DIAGRAM

```text
Claim vendor → Map sang Problem thật → PoC nhỏ → Metrics (M5) → Keep/Drop
```

### 5–7. DEMO / GUIDED / REAL
`/lab/D-functionize.md` — PoC plan 1 trang (dù chỉ desktop research nếu không account).

### 8. VALIDATE
PoC plan có success metrics · có rủi ro lock-in

### 9. MEASURE
(Nếu PoC chạy) thời gian gen 1 flow vs Playwright+AI

### 10. DOCUMENT & REUSE
→ map.

---

## LESSON 8.5 — Lab E: Tricentis (enterprise lens)

### 1. PROBLEM
Enterprise hỏi AI nằm đâu trong ecosystem lớn ( Tosca & co. ) — không cần thành expert.

### 2. WHY IT MATTERS
BA/Tester cần nói chuyện được với quản lý tool enterprise.

### 3. MINIMUM THEORY
Chỉ **hiểu**: AI gắn vào quản lý test, risk, automation enterprise — không hands-on sâu.

### 4. DIAGRAM

```text
[Req Mgmt] ── [Test Mgmt] ── [Automation] ── [Reporting]
                    ↑ AI features xen vào các tầng
```

### 5–7. DEMO / GUIDED / REAL
Đọc overview chính thức / talk → `/lab/E-tricentis.md` — 1 trang: AI ở tầng nào, khác gì stack Playwright của bạn.

### 8. VALIDATE
Không claim đã “thành thạo Tosca” · nêu được 2 khác biệt enterprise vs team nhỏ

### 9. MEASURE
N/A (comprehension check: 5 câu hỏi ngắn tự chấm)

### 10. DOCUMENT & REUSE
→ map.

---

## LESSON 8.6 — Advanced Lab: Agent-browser / browser-use

### 1. PROBLEM
Playwright = script cố định. Agent = Goal → Observe → Reason → Act. Khi nào agent hơn?

### 2. WHY IT MATTERS
Nhầm agent với automation ổn định → flaky, khó audit, khó evidence.

### 3. MINIMUM THEORY

```text
PLAYWRIGHT          AGENT
Script → Execute    Goal → Observe → Reason → Act
Deterministic       Linh hoạt, kém deterministic
```

Dùng agent: exploratory, thay đổi UI mạnh, spike.  
Không dùng thay regression核心 đã ổn.

**Spiral:** Agent vs Automation = **Cơ bản (concept)**.

### 4. DIAGRAM

| Tiêu chí | Playwright | Agent-browser |
|---|---|---|
| Lặp regression | Mạnh | Yếu hơn (non-deterministic) |
| Khám phá | Trung bình | Mạnh |
| Audit/evidence | Rõ (code+trace) | Cần thiết kế thêm |
| Chi phí predict | Cao hơn lúc đầu | “Nhanh thử” nhưng maintain khó |

```text
Cần deterministic regression? → Playwright
Cần khám phá goal-based? → Agent (lab)
Cần cả hai? → Playwright core + Agent explorers
```

### 5. LIVE DEMO
(Demo) Agent: “Thêm item và đi tới Checkout” vs script Playwright cùng mục tiêu.

### 6. GUIDED PRACTICE
Viết 5 tiêu chí chọn Agent vs Script cho Checkout.

### 7. REAL TASK
`/lab/F-agent-browser.md` + cập nhật **`/lab/ECOSYSTEM-MAP.md`** (tất cả lab A–F).

### 8. VALIDATE
Không khuyến nghị thay suite M6 bằng agent · có decision tree · có rủi ro

### 9. MEASURE
(Nếu chạy thử) số bước thành công / số lần agent lệch mục tiêu

### 10. DOCUMENT & REUSE
Ecosystem map → M9 chọn tool nào xuất hiện trong evidence (thường chỉ Playwright + optional 1 lab).

---

## TỔNG KẾT MODULE 8

### Output
- `/lab/A-applitools.md` … `/lab/F-agent-browser.md`
- **`/lab/ECOSYSTEM-MAP.md`**
- Rubric đánh giá tool

### → Module 9
Capstone ghép evidence — không thêm tool mới trừ khi đã lab.

### Spiral
Agent vs Automation = Cơ bản · AI+Automation mở rộng ecosystem awareness
