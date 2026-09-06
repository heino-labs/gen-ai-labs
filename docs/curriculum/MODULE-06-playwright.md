- **Mục tiêu module:** Học **automation duy nhất cần sâu** — Playwright — và ra một test suite thật từ TC Checkout đã approve.
- **Vì sao cần:** M5 đã có TC tin cậy. M6 biến phần **đáng automating** thành script + evidence.
- **Spiral:** Structured JSON M3/M4 → map sang code. Measurement: manual exec time vs automation.
- **Không:** Selenium, DevOps sâu, framework zoo.
- **Case:** Checkout (flow có thể dùng demo site công khai hoặc mock app team chọn — ghi rõ trong README)

---

## LESSON 6.1 — Automation mindset

### 1. PROBLEM
Team muốn “automate hết Checkout”. Có TC exploratory, TC data phụ thuộc tay, TC UI đổi tuần — automate sẽ đau.

### 2. WHY IT MATTERS
Automate sai thứ = chi phí maintain > giá trị.

### 3. MINIMUM THEORY
Đáng automate khi: **Repetitive · Deterministic · High frequency · Stable** (UI/API ổn).

### 4. DIAGRAM

```text
Approved TC
    ↓
Checklist 4 tiêu chí
    ↓
    ├─ Yes ≥3/4 → Candidate automation
    └─ No → Giữ manual / exploratory
```

| Giữ Manual | Automate |
|---|---|
| UX cảm quan, one-off, UI bất ổn | Happy path payment mock, regression lặp |

### 5. LIVE DEMO
Chấm 8 TC Checkout → chọn 3 candidate.

### 6. GUIDED PRACTICE
Bảng TC_ID | Rep | Det | Freq | Stable | Quyết định.

### 7. REAL TASK
`/automation/candidates-checkout.md` — list TC sẽ code ở 6.3.

### 8. VALIDATE
Mọi candidate có lý do · mọi “không automate” có lý do · không chọn TC chưa Approve M5

### 9. MEASURE
% TC candidate · ước lượng phút manual/tuần sẽ tiết kiệm

### 10. DOCUMENT & REUSE
Candidates → 6.2/6.3.

---

## LESSON 6.2 — Playwright đủ dùng

### 1. PROBLEM
Cần đủ khái niệm để đọc/viết test Checkout — không khoá học Playwright 20 giờ.

### 2. WHY IT MATTERS
Thiếu nền = không review được code AI sinh ở M7.

### 3. MINIMUM THEORY

| Khái niệm | Ý nghĩa |
|---|---|
| Browser / Page | Phiên trình duyệt / tab |
| Locator | Cách tìm element |
| Action | click, fill, … |
| Assertion | expect |
| Test | khối test() |
| Fixture | setup/reuse (vd: page đã login) |
| Trace / Screenshot | evidence khi fail |

**Spiral Playwright:** lần đầu = **Cơ bản**.

### 4. DIAGRAM

```text
test('checkout card success')
   → open page
   → locate + actions
   → assertions
   → artifact (screenshot/trace on fail)
```

### 5. LIVE DEMO
1 test mở trang demo, fill form giả, assert URL/text — chạy local `npx playwright test`.

### 6. GUIDED PRACTICE
Sửa locator cố ý sai → xem fail + trace; sửa lại.

### 7. REAL TASK
Repo `/automation/playwright-checkout/` scaffold: README, config, 1 smoke test xanh.

### 8. VALIDATE
Smoke xanh trên máy học viên · README chạy được từ zero · biết bật trace

### 9. MEASURE
Thời gian setup · thời gian chạy smoke

### 10. DOCUMENT & REUSE
Scaffold → viết suite 6.3.

---

## LESSON 6.3 — Manual → Automation

### 1. PROBLEM
Có TC JSON approved. Cần biến thành Playwright + evidence.

### 2. WHY IT MATTERS
Đây là cầu nối sang M7 (AI generate). Học viên phải làm tay ít nhất 1–2 TC để biết “đúng” trông thế nào.

### 3. MINIMUM THEORY

```text
Manual TC → Automation Design (steps map locator) → Playwright → Run → Evidence
```

### 4. DIAGRAM

| Manual execution | Automation |
|---|---|
| 7 phút/lần, dễ lệch bước | ~30s, lặp ổn nếu locator tốt |

```text
TC_ID
  ↓ Design sheet: Step | Locator strategy | Data | Assert
  ↓ Code
  ↓ CI local run
  ↓ Pass + screenshot / Fail + trace
```

### 5. LIVE DEMO
Map 1 TC payment success → design sheet → code → pass.

### 6. GUIDED PRACTICE
Học viên code TC thứ 2 (payment fail hoặc out-of-stock) theo design sheet mẫu.

### 7. REAL TASK
Suite ≥3 tests từ candidates + **`/automation/evidence/`** (screenshot/trace mẫu) + **`/automation/DESIGN-checkout.md`**.

### 8. VALIDATE
Mọi test map TC_ID · không hardcode secret · fail có evidence · README liệt kê TC covered

### 9. MEASURE

| | Manual | Automation |
|---|---|---|
| Thời gian chạy 3 TC | ___ | ___ |
| Flaky (fail không rõ nguyên nhân)/10 runs | — | ___ |

### 10. DOCUMENT & REUSE
Suite + design = baseline M7 (AI generate/debug/maintain).

---

## TỔNG KẾT MODULE 6

### Output
- `/automation/candidates-checkout.md`
- `/automation/playwright-checkout/` (suite thật)
- `/automation/DESIGN-checkout.md`
- `/automation/evidence/`

### → Module 7
Ghép AI vào generate / debug / maintain suite này.

### Spiral
Playwright = **Cơ bản có suite** · Measurement có exec time & flaky
