- **Mục tiêu module:** Áp dụng AI vào **công việc thật** BA và Tester theo luồng nghiệp vụ — ra **BA/Tester AI Playbook**.
- **Vì sao cần:** M3 có assets; M4 gắn assets vào từng bước Analyze→Design→… không học theo “feature AI”.
- **Spiral:** Prompt/Context/Rule/Structured từ M3 → dùng trong từng job step. Measurement = time + completeness + rework.
- **Case:** Checkout · **Tool:** Claude · **Assets bắt buộc:** `/prompt` `/context` `/rules`

**Công thức mọi lesson M4:**

```text
Manual → AI → Compare → Validate → Measure
```

---

## LESSON 4.1 — BA: Requirement Review & Questions

### 1. PROBLEM
Req Checkout mơ hồ: “hết hàng giữa chừng thì báo lỗi” — bao giờ reserve stock? AI và bạn cùng review.

### 2. WHY IT MATTERS
Bỏ sót ambiguity → AC sai → test sai hàng loạt.

### 3. MINIMUM THEORY
**Ambiguity** = chỗ nhiều cách hiểu. BA dùng AI để **mở rộng câu hỏi**, không để AI **chốt rule**.

Spiral Context: lần này context = full pack + Limitation Report (cấm invent).

### 4. DIAGRAM

| Manual | AI-assisted |
|---|---|
| Đọc req → ghi câu hỏi | Prompt review + `/context` + `/rules` → draft questions |
| Ít góc nhìn | Nhiều góc; dễ bịa → phải filter |

```text
Req → AI draft questions → Human filter → Clarification list (approved)
```

### 5. LIVE DEMO
Prompt: liệt kê ambiguity theo nhóm Payment / Inventory / UX / Error handling — JSON.

### 6. GUIDED PRACTICE
Manual 10 phút câu hỏi → AI 10 phút → bảng Compare: Only-Human / Only-AI / Both · đánh dấu AI bịa.

### 7. REAL TASK
**`/playbook/ba-01-review-questions.md`** + `/output/checkout-clarifications.md` (chỉ mục Human duyệt).

### 8. VALIDATE
Mọi câu hỏi map được đoạn req · không câu hỏi giả định voucher nếu không có trong context · BA sign-off list

### 9. MEASURE
| | Manual | AI-assisted |
|---|---|---|
| Thời gian | ___ | ___ |
| Ambiguity giữ lại | ___ | ___ |
| Câu AI bị loại | ___ | ___ |

### 10. DOCUMENT & REUSE
Clarifications → cập nhật `/context/business-rules.md` khi PO trả lời.

---

## LESSON 4.2 — BA: Business Rules & Acceptance Criteria

### 1. PROBLEM
Cần AC cho Checkout (thẻ, ví, hết hàng, timeout payment) — viết tay chậm; AI viết nhanh nhưng hay thêm rule.

### 2. WHY IT MATTERS
AC là contract. Sai AC = sai toàn bộ test + automation sau này.

### 3. MINIMUM THEORY
**Business Rule** = ràng buộc nghiệp vụ. **AC** = điều kiện chấp nhận có thể kiểm chứng.  
Rule AI: mọi BR/AC phải có nguồn (req ID hoặc clarification ID).

### 4. DIAGRAM

```text
Req + Clarifications
        ↓
AI draft BR/AC (structured)
        ↓
Rule check (no invent, traceability)
        ↓
BA edit + PO confirm
        ↓
/context/acceptance-criteria.md (source of truth)
```

### 5. LIVE DEMO
AI draft AC dạng Given/When/Then + `req_id`. Human xoá AC không có nguồn.

### 6. GUIDED PRACTICE
3 AC payment success/fail/timeout — Manual 1, AI 1, merge.

### 7. REAL TASK
Cập nhật **`/context/checkout/acceptance-criteria.md`** + **`/context/checkout/business-rules.md`**.  
Ghi **`/playbook/ba-02-br-ac.md`**.

### 8. VALIDATE
100% AC có nguồn · không AC ngoài scope · PO/BA tick approve (checklist)

### 9. MEASURE
Rework rounds · % AC bị xoá vì invent · thời gian đến bản approve

### 10. DOCUMENT & REUSE
AC approved = ground truth sơ bộ cho M5 + input Tester.

---

## LESSON 4.3 — BA: Impact Analysis & Documentation

### 1. PROBLEM
Đổi rule “hết hàng”: ảnh hưởng cart, payment, email, admin stock — dễ sót khi chỉ nghĩ tay.

### 2. WHY IT MATTERS
Sót impact = regression lỗ. AI giúp liệt kê; BA chịu trách nhiệm danh sách cuối.

### 3. MINIMUM THEORY
**Impact analysis** = hệ quả thay đổi lên module/luồng/dữ liệu/stakeholder.

### 4. DIAGRAM

```text
Change request
   ↓
AI: impact candidates (systems × flows × data)
   ↓
BA: confirm / reject
   ↓
Doc update checklist
```

### 5. LIVE DEMO
CR: “Thêm COD” — AI list impact; Human loại gì ngoài scope khoá học / hệ thống không có.

### 6. GUIDED PRACTICE
Impact matrix bảng: Area | Impact | Risk | Test needed?

### 7. REAL TASK
CR Checkout thật (vd: thêm ví mới) → **`/output/checkout-impact.md`** + playbook note.

### 8. VALIDATE
Mỗi impact có lý do · không area bịa · có cột “cần test”

### 9. MEASURE
Số area sót (peer tìm thêm) · thời gian

### 10. DOCUMENT & REUSE
Impact → Tester ưu tiên scenario (4.4).

---

## LESSON 4.4 — Tester: Test Conditions & Scenarios

### 1. PROBLEM
Từ AC Checkout → test conditions/scenarios. AI sinh ồ ạt trùng và thiếu timeout.

### 2. WHY IT MATTERS
Thiếu condition = lỗ coverage. Trùng = phí thời gian.

### 3. MINIMUM THEORY
**Test condition** = cái có thể kiểm. **Scenario** = luồng gắn điều kiện.  
Dùng prompt `/prompt/checkout-test-conditions.md` + rules.

### 4. DIAGRAM

| Manual | AI-assisted |
|---|---|
| AC → conditions | AI draft → human dedupe + gap analysis |

```text
AC → AI conditions → Dedupe → Gap vs AC → Scenarios
```

### 5. LIVE DEMO
Map AC → conditions; tìm AC không có condition (gap) và condition không có AC (orphan/bịa).

### 6. GUIDED PRACTICE
Coverage matrix: AC_ID × Condition_ID.

### 7. REAL TASK
**`/output/checkout-conditions.md`** + **`/output/checkout-scenarios.md`** + playbook tester-01.

### 8. VALIDATE
Mọi AC ≥1 condition · 0 orphan không giải thích · ưu tiên H gắn payment/inventory

### 9. MEASURE
Coverage % AC · số trùng bị gộp · thời gian

### 10. DOCUMENT & REUSE
Scenarios → 4.5 test cases JSON.

---

## LESSON 4.5 — Tester: Test Cases, Data & Review

### 1. PROBLEM
Cần TC + data (thẻ thành công/fail, user hết hàng) — AI viết steps ảo (click nút không tồn tại).

### 2. WHY IT MATTERS
Steps ảo = automation M6/M7 sụp. Review lúc này rẻ hơn debug Playwright.

### 3. MINIMUM THEORY
TC structured + **test data** tách file. Review checklist: traceability, feasibility UI, expected rõ, data khả thi.

### 4. DIAGRAM

```text
Scenarios → AI TC JSON → Rule check → Human review → Approved TC + /data
```

### 5. LIVE DEMO
1 scenario payment timeout → AI TC → bắt steps không khả thi.

### 6. GUIDED PRACTICE
Review 5 TC AI theo checklist 6 mục (pass/fail từng mục).

### 7. REAL TASK
**`/output/checkout-testcases.json`** + **`/data/checkout-testdata.md`** + **`/playbook/tester-02-tc-data-review.md`**.  
Tổng hợp **`/playbook/BA-TESTER-AI-PLAYBOOK.md`** (mục lục link toàn bộ ba-*/tester-*).

### 8. VALIDATE
JSON parse · mọi TC có req_id/ac_id · data không chứa PII thật · review sign-off

### 9. MEASURE
| | Manual | AI-assisted |
|---|---|---|
| Thời gian draft TC | ___ | ___ |
| % TC pass review lần 1 | ___ | ___ |
| Rework rounds | ___ | ___ |

### 10. DOCUMENT & REUSE
Approved TC = đầu vào M5 validation protocol & M6 automation.

---

## TỔNG KẾT MODULE 4

### Output
- `/playbook/BA-TESTER-AI-PLAYBOOK.md` (+ ba-01/02, tester-01/02)
- `/context` cập nhật BR/AC
- `/output/checkout-clarifications.md`, `impact`, `conditions`, `scenarios`, `testcases.json`
- `/data/checkout-testdata.md`

### → Module 5
Dùng Playbook + TC để trả lời: *Làm sao biết AI làm đúng?*

### Spiral sau M4
Prompt/Context/Rule/Structured = **Practical (gắn job)** · Measurement có coverage & rework
