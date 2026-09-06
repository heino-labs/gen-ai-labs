- **Mục tiêu module:** **Ghép + trình bày evidence** — không dạy nội dung mới. Project E-commerce Checkout đã làm từ M2–M8 được đóng gói thành chứng minh giá trị.
- **Vì sao cần:** Spiral learning cần điểm hội tụ: một câu chuyện end-to-end + số liệu.
- **Spiral:** Validation/Measurement/Prompt/Automation lên mức **Production evidence**.
- **Case:** Checkout · Tool: Claude · Chỉ dùng asset đã có

> Module 9 **cấm** thêm tool/lý thuyết mới. Nếu thiếu → quay lại module tương ứng.

---

## LESSON 9.1 — Evidence corpus audit

### 1. PROBLEM
Folder học viên lộn xộn: thiếu Limitation Report hoặc TC chưa approve đã automate.

### 2. WHY IT MATTERS
Capstone không phải “làm thêm” — là **chứng minh chuỗi đã chạy**.

### 3. MINIMUM THEORY
**Evidence corpus** = bộ artifact truy vết được từ Req → Measure.

### 4. DIAGRAM

```text
Req → AI Analysis → Rules → Test Design → Validation
   → Playwright → AI Automation → Evidence → Measurement
```

Checklist tồn tại file (Y/N) theo từng mắt xích.

### 5. LIVE DEMO
Audit 1 bộ mẫu (teacher) — chỉ ra mắt xích gãy.

### 6. GUIDED PRACTICE
Tự audit repo học viên bằng checklist.

### 7. REAL TASK
`/capstone/AUDIT.md` — lỗ hổng + plan vá (pointer về M2–M8, không vá kiểu mới).

### 8. VALIDATE
Mọi mắt xích Y hoặc có lý do chấp nhận được · không “tự nhận đủ” khi thiếu protocol

### 9. MEASURE
% artifact bắt buộc có mặt

### 10. DOCUMENT & REUSE
Audit → 9.2 narrative.

---

## LESSON 9.2 — Chuỗi Checkout end-to-end (narrative + demo)

### 1. PROBLEM
Cần kể được câu chuyện 8 bước (như curriculum) kèm artifact thật.

### 2. WHY IT MATTERS
Nhà tuyển dụng/PO/manager hiểu giá trị qua story + proof, không qua danh sách tool.

### 3. MINIMUM THEORY
8 bước kể chuyện:

```text
1 BA ambiguity      2 Tester conditions/TC
3 Rules             4 Validation gates
5 Playwright        6 AI assist (gen/debug)
7 Measure           8 Evidence pack
```

### 4. DIAGRAM
Dùng lại sơ đồ chuỗi ở 9.1 — gắn **link file** vào mỗi nút.

### 5. LIVE DEMO
Teacher walkthrough 15 phút một chuỗi hoàn chỉnh.

### 6. GUIDED PRACTICE
Học viên viết script thuyết trình 5 phút (outline).

### 7. REAL TASK
`/capstone/STORY-checkout.md` + demo chạy ≥1 test Playwright + mở 1 log AI debug.

### 8. VALIDATE
Mỗi bước story có artifact · demo chạy được · không bước nào chỉ “nói miệng”

### 9. MEASURE
Thời gian demo dry-run · số lỗi demo (mục tiêu 0 blocker)

### 10. DOCUMENT & REUSE
Story → slide/PDF ngắn nếu cần (optional).

---

## LESSON 9.3 — Metrics trước/sau & Prove value

### 1. PROBLEM
Cần số liệu chứng minh cách mới tốt hơn cách cũ trên Checkout.

### 2. WHY IT MATTERS
Đây là “câu một dòng” của cả khoá — có số thì thuyết phục.

### 3. MINIMUM THEORY
Lấy từ `/validation/metrics-checkout.md` + automation times + AI logs. Thiếu số → đo bổ sung **cùng scope**, không bịa.

Ví dụ khung:

| Hạng mục | Before | After |
|---|---|---|
| Review ambiguity | 60 phút | 22 phút |
| Coverage AC | 72% | 91% |
| Chạy 3 TC regression | 7 phút | 30 giây |
| Debug fail | 20 phút | 7 phút |

### 4. DIAGRAM

| Cách cũ (Manual) | Cách mới (AI-assisted + Playwright) |
|---|---|
| … số liệu … | … số liệu … |

### 5. LIVE DEMO
Điền bảng từ evidence có sẵn; đánh dấu ô ước lượng vs đo thật.

### 6. GUIDED PRACTICE
Tách metrics: cứng (đo được) / mềm (ước lượng) — chỉ report cứng ra ngoài nếu có thể.

### 7. REAL TASK
`/capstone/PROVE-VALUE.md` + cập nhật metrics.

### 8. VALIDATE
Không claim không có số · phân biệt measured vs estimated · có caveat

### 9. MEASURE
Số ô measured / tổng ô

### 10. DOCUMENT & REUSE
Prove-value = trang bìa capstone pack.

---

## LESSON 9.4 — Capstone pack & retrospective

### 1. PROBLEM
Nộp sản phẩm khoá học: một pack sạch + học gì sẽ siết ở vòng sau.

### 2. WHY IT MATTERS
Đóng spiral: concept quay lại ở mức **Production**.

### 3. MINIMUM THEORY
Pack tối thiểu:

```text
/capstone/
  README.md                 # cách đọc pack
  AUDIT.md
  STORY-checkout.md
  PROVE-VALUE.md
  links.md                  # pointer tới /prompt /context /rules /validation /automation /lab
```

Retrospective: 3 keep / 3 improve / 1 experiment (vd: thêm visual lab).

### 4. DIAGRAM

```text
Pack nộp
  ├─ Story
  ├─ Metrics
  ├─ Links assets
  └─ Retro → input khoá sau / on-the-job
```

### 5. LIVE DEMO
Mẫu README capstone.

### 6. GUIDED PRACTICE
Peer review chéo 2 pack (checklist 10 mục).

### 7. REAL TASK
Hoàn thiện `/capstone/**` + trình bày 5–8 phút.

### 8. VALIDATE
Peer ≥8/10 · mọi link sống · demo dự phòng (video) nếu môi trường fail

### 9. MEASURE
Peer score · thời gian chuẩn bị thuyết trình

### 10. DOCUMENT & REUSE
Pack = portfolio; retro = backlog cải thiện rules/prompts.

---

## TỔNG KẾT MODULE 9

### Output
- `/capstone/README.md`, `AUDIT.md`, `STORY-checkout.md`, `PROVE-VALUE.md`, `links.md`
- Metrics cuối khoá
- Thuyết trình ngắn

### Output toàn khoá (nhắc)
Limitation Report · Prompt/Context/Rules · Playbook · Validation Protocol · Playwright suite · AI workflow · Ecosystem map · Capstone pack

### Spiral cuối

| Khái niệm | Mức cuối |
|---|---|
| Prompt | Production (gen/debug/maintain) |
| Context / Rule | Pack vận hành |
| Hallucination | Gated bởi protocol |
| Validation | Operational + evidence |
| Measurement | Prove value |
| Playwright | Suite thật |
| AI + Automation | Workflow có log |
| Agent vs Script | Decision trong ecosystem map |
