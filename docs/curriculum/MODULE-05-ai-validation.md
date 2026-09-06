- **Mục tiêu module:** Trả lời “Làm sao biết AI làm đúng?” bằng **AI-VALIDATION-PROTOCOL** — không evaluation hàn lâm.
- **Vì sao cần:** M4 đã có output AI hàng loạt. Không protocol → chất lượng phụ thuộc “cảm giác”.
- **Spiral:** Hallucination M2 **Cơ bản → Kiểm soát** qua Rule + Ground truth + Human review. Measurement formal hoá.
- **Case:** Checkout · Input: `/output/checkout-testcases.json`, `/rules`, `/context`

---

## LESSON 5.1 — Rule validation

### 1. PROBLEM
Có 30 TC AI. Không muốn đọc hết mới thấy thiếu `req_id` hoặc invent payment method.

### 2. WHY IT MATTERS
Rule validation bắt lỗi rẻ và nhanh trước human review sâu.

### 3. MINIMUM THEORY
**Rule validation** = Pass/Fail theo rule M3 áp lên output.

### 4. DIAGRAM

```text
AI Output → Rule checklist → Pass / Fail (+ lý do)
          ┌─ Traceability
Output ───┼─ No-invent
          ├─ Format/schema
          └─ Safety → % rules passed
```

### 5. LIVE DEMO
10 rules × 5 TC — fail thiếu `ac_id`, có “COD” ngoài context.

### 6. GUIDED PRACTICE
Tạo `/validation/rule-checklist-checkout.md`. Chấm 10 TC.

### 7. REAL TASK
Validate toàn bộ JSON → `/validation/rule-results.md`.

### 8. VALIDATE
Mọi fail có rule_id · không fail theo cảm tính · pass rate đúng

### 9. MEASURE
% rules passed · thời gian rule-check vs đọc full · lỗi chặn trước human

### 10. DOCUMENT & REUSE
Checklist + results → protocol.

---

## LESSON 5.2 — Ground truth compare

### 1. PROBLEM
TC “pass rule” nhưng expected sai so với AC đã approve.

### 2. WHY IT MATTERS
Rule = hình thức/ràng buộc. Đúng nghiệp vụ cần ground truth.

### 3. MINIMUM THEORY
**Ground truth** = AC/BR approved. So AI field ↔ GT.  
Spiral Validation: tầng 2 sau Rule.

### 4. DIAGRAM

```text
AI Output ──compare──► Ground Truth
        → Match / Partial / Conflict / Missing
```

| Manual only | AI + Ground truth |
|---|---|
| Review theo trí nhớ | Diff theo AC_ID |

### 5. LIVE DEMO
Payment fail: AI “retry vô hạn” vs AC “max 3 rồi huỷ” → Conflict.

### 6. GUIDED PRACTICE
Bảng TC_ID | AC_ID | Match? — ≥8 TC.

### 7. REAL TASK
`/validation/ground-truth-diff-checkout.md` + sửa Conflict.

### 8. VALIDATE
Conflict có trích AC · Missing mở clarification · không im lặng coi đúng

### 9. MEASURE
% Match · số Conflict · thời gian/diff

### 10. DOCUMENT & REUSE
Diff → ưu tiên human review.

---

## LESSON 5.3 — Human review (layered)

### 1. PROBLEM
Không đủ người đọc hết — cần máy lọc rồi người tập trung rủi ro.

### 2. WHY IT MATTERS
Human 100% không scale; Human 0% nguy hiểm.

### 3. MINIMUM THEORY

```text
AI → Machine (Rule + GT) → Human (high risk / conflict / sample)
```

Sampling: 100% High (payment, inventory); sample Medium; Low theo %.

### 4. DIAGRAM

```text
All outputs → Machine gate → GT compare
  → Conflict/High: Human mandatory
  → Medium: Sample N%
  → Low+Match: Spot check
```

### 5. LIVE DEMO
12 TC → 3 bucket; human 100% High + Conflict.

### 6. GUIDED PRACTICE
Human Review Charter: ai, SLA, sign-off.

### 7. REAL TASK
`/validation/human-review-log-checkout.md`.

### 8. VALIDATE
0 High chưa human · Approve có tên/ngày · Reject actionable

### 9. MEASURE
% cần human · thời gian human · theo dõi escape defect

### 10. DOCUMENT & REUSE
Charter + log → protocol.

---

## LESSON 5.4 — Measurement & Protocol

### 1. PROBLEM
Team nói “AI giúp” nhưng không có bộ chỉ số chung.

### 2. WHY IT MATTERS
Không measure → không cải prompt/rules, không chứng minh giá trị.

### 3. MINIMUM THEORY
Accuracy · Coverage · Completeness · Duplicate · Rework · Time

### 4. DIAGRAM

```text
Baseline Manual vs AI-assisted → bảng metrics → siết rule / sửa prompt / giữ
```

### 5–7. DEMO / GUIDED / REAL
Điền metrics từ M4+5.1–5.3 → viết **`/validation/AI-VALIDATION-PROTOCOL.md`** (6 mục: Gates, Checklists, Sampling, Metrics, Cấm ship, Links) + **`/validation/metrics-checkout.md`**.

### 8. VALIDATE
Đủ 6 mục · có before/after hoặc Manual vs AI · có cấm ship

### 9. MEASURE
Bảng metrics lần 1 hoàn chỉnh (có số).

### 10. DOCUMENT & REUSE
Protocol → M7, M9.

---

## TỔNG KẾT MODULE 5

| Asset | Path |
|---|---|
| Rule checklist + results | `/validation/rule-*` |
| GT diff | `/validation/ground-truth-diff-checkout.md` |
| Human review | `/validation/human-review-log-checkout.md` |
| **AI-VALIDATION-PROTOCOL** | `/validation/AI-VALIDATION-PROTOCOL.md` |
| Metrics | `/validation/metrics-checkout.md` |

**→ M6:** Chỉ automate TC **Approved**.

**Spiral:** Validation = Operational · Hallucination = gated · Measurement = formal
