- **Mục tiêu module:** Điểm “wow” — workflow **AI-assisted Playwright**: generate → debug → maintain, vẫn human verify.
- **Vì sao cần:** M6 làm tay được nhưng chậm khi TC nhiều. M7 dùng AI đúng chỗ + Validation M5.
- **Spiral:** Prompt lên mức **Automation**; Validation áp lên code; Playwright **Cơ bản → AI-assisted**.
- **Case:** Checkout · Tool: Claude · Suite M6 + `/rules` + protocol M5

**Luồng khoá:**

```text
Requirement → AI → Test Case → AI → Playwright → Run
    → AI Analyze Failure → Tester Verify → Measure
```

---

## LESSON 7.1 — AI generate automation

### 1. PROBLEM
Còn 5 TC candidate chưa code. Muốn Claude sinh Playwright từ TC JSON + design sheet.

### 2. WHY IT MATTERS
Generate không kiểm soát = locator rác, bỏ assert, bịa selector.

### 3. MINIMUM THEORY
Prompt generate phải có: Role (automation eng), TC JSON, rules (không bịa locator nếu thiếu info → hỏi), Example 1 test đã pass từ M6, Format (file test).

**Spiral Prompt:** mức **tạo Playwright**.

### 4. DIAGRAM

| Manual code | AI generate |
|---|---|
| Chậm, kiểm soát cao | Nhanh; cần rule + review + chạy thật |

```text
Approved TC + Example test xanh + Rules
        ↓
   Claude generate
        ↓
   Human review diff
        ↓
   playwright test
        ↓
   Pass / Fail
```

### 5. LIVE DEMO
Sinh 1 test từ TC; so với style M6; chạy.

### 6. GUIDED PRACTICE
Prompt v1 không example → v2 có example; đo số sửa.

### 7. REAL TASK
`/prompt/checkout-generate-playwright.md` + ≥2 tests AI-generated **đã chạy xanh** sau review.  
Ghi `/automation/AI-GENERATE-LOG.md`.

### 8. VALIDATE
Áp rule checklist code (có assert, có TC_ID comment, không secret) · test xanh · human sign-off

### 9. MEASURE
Phút/test manual M6 vs AI-assisted · số dòng sửa sau generate · % pass lần chạy 1

### 10. DOCUMENT & REUSE
Prompt generate versioned → 7.2/7.3.

---

## LESSON 7.2 — AI debug automation

### 1. PROBLEM
Test đỏ: timeout locator. Log dài. Claude có thể đề xuất sai (“đợi 30s”).

### 2. WHY IT MATTERS
AI debug hay **đoán**; tester phải verify bằng trace/evidence.

### 3. MINIMUM THEORY
Input debug: error message, trace snippet, đoạn code, expected từ TC — **không** chỉ paste “fix giúp”.  
Output: giả thuyết xếp hạng + bước chứng minh.

**Spiral:** Validation trên lời khuyên AI (machine = tái chạy test; human = chọn giả thuyết).

### 4. DIAGRAM

```text
Fail → thu thập evidence → AI hypotheses
         ↓
    Tester chọn 1–2 giả thuyết
         ↓
    Thử fix nhỏ → re-run
         ↓
    Xác nhận / rollback
```

| Manual diagnosis | AI-assisted |
|---|---|
| 20 phút đọc trace | 7 phút nếu evidence đủ; lệch nếu evidence thiếu |

### 5. LIVE DEMO
Cố ý phá locator → AI debug với/không trace → so chất lượng.

### 6. GUIDED PRACTICE
Template `/prompt/checkout-debug-playwright.md`.

### 7. REAL TASK
Gây 2 fail có chủ đích + 1 fail thật nếu có → log `/automation/AI-DEBUG-LOG.md` (trước/sau thời gian).

### 8. VALIDATE
Mỗi fix có evidence re-run · không accept “tăng timeout” nếu chưa chứng minh root cause · giả thuyết AI bị bác bỏ được ghi lại

### 9. MEASURE
Manual diagnosis time vs AI-assisted · số hypothesisi đúng/tổng

### 10. DOCUMENT & REUSE
Debug prompt + anti-patterns (timeout mù) → playbook.

---

## LESSON 7.3 — AI maintain automation

### 1. PROBLEM
UI Checkout đổi text nút “Thanh toán” → “Pay now”. Nhiều test gãy. Cần strategy maintain có AI — không rewrite toàn bộ mù.

### 2. WHY IT MATTERS
Phần lớn chi phí automation là maintain. Đây là kỹ năng khác generate.

### 3. MINIMUM THEORY
Maintain = impact analysis (như BA M4) trên **locator/flow** + patch có kiểm soát + regression chạy lại + cập nhật TC nếu hành vi đổi.

### 4. DIAGRAM

```text
UI/API change
   ↓
AI: list tests impacted (từ suite)
   ↓
Human confirm
   ↓
AI patch đề xuất
   ↓
Review + run suite
   ↓
Update DESIGN / TC nếu cần
```

### 5. LIVE DEMO
Đổi 1 data-testid / text → AI list impacted tests.

### 6. GUIDED PRACTICE
Change request giả lập → maintain report.

### 7. REAL TASK
Thực hiện 1 change trên app/demo hoặc mock selector → AI maintain → suite xanh.  
Đóng gói workflow **`/automation/AI-ASSISTED-PLAYWRIGHT-WORKFLOW.md`**.

### 8. VALIDATE
Impact list không sót test liên quan (peer check) · diff tối thiểu · metrics cập nhật

### 9. MEASURE
Thời gian maintain 1 change · số test sửa · số lần chạy đến xanh

### 10. DOCUMENT & REUSE
Workflow = artifact trung tâm đưa sang M8/M9.

---

## TỔNG KẾT MODULE 7

### Output
| Asset | Path |
|---|---|
| Prompt generate/debug | `/prompt/checkout-*-playwright.md` |
| Logs generate/debug | `/automation/AI-*-LOG.md` |
| **Workflow** | `/automation/AI-ASSISTED-PLAYWRIGHT-WORKFLOW.md` |
| Suite mở rộng | `/automation/playwright-checkout/` |

### → Module 8
So pattern Playwright cố định với Visual AI / low-code / agent — không bỏ Playwright.

### Spiral
Prompt = **Automation/Production path** · AI+Automation = **Operational** · Validation áp cho code
