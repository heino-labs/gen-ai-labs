Sau module này bạn biết ba việc:
1. Mình đang nói chuyện với loại AI nào.
2. Vì sao hỏi đại thường ra câu trả lời “hay nhưng sai”.
3. Làm sao soi được chỗ AI bịa — rồi ghi lại cho đội biết giới hạn ở đâu.

Không cần thuộc thuật ngữ. Cần **hiểu đúng để dùng đúng**.

Chọn một chatbot (ChatGPT, Claude, Copilot…) và dùng cố định trong cả module.

---

## LESSON 2.1 — “AI” không phải một thứ duy nhất

### Câu chuyện mở đầu
Trong họp, ai đó nói: “Team mình dùng AI rồi.”  

Nhưng mỗi người đang nói một việc khác nhau:
- Người A: web bán hàng **gợi ý sản phẩm**.
- Người B: tool **chấm điểm rủi ro gian lận** thẻ.
- Người C: mở **ChatGPT** nhờ viết test case.

Cả ba đều “AI”, nhưng không cùng một nghề.

### Ba lớp cho dễ nhớ

Hãy tưởng tượng hộp lồng nhau:

**1. AI (ô lớn nhất)**  
Máy làm việc na ná người: đoán, phân loại, gợi ý, viết…  

**2. GenAI (ô nhỏ hơn)**  
AI biết **tạo ra cái mới**: đoạn văn, email, test case, đoạn code.  
Không chỉ trả lời “có/không” hay “điểm rủi ro = 0.8”.

**3. LLM (ô bạn dùng mỗi ngày)**  
GenAI chuyên **chữ và hội thoại**. ChatGPT / Claude / Copilot gần như chắc thuộc nhóm này.

### Ví dụ thực tế (xếp nhanh)

| Việc bạn gặp | Thuộc nhóm nào? | Vì sao |
|---|---|---|
| Gmail lọc spam | AI | Chủ yếu phân loại thư rác / không rác |
| TikTok / shopee gợi ý nội dung, sản phẩm | AI | Đoán bạn thích gì |
| ChatGPT viết mô tả bug giúp bạn | GenAI / LLM | Tạo đoạn chữ mới |
| Grammarly gạch lỗi chính tả | AI | Phát hiện / phân loại lỗi (không phải “viết cả bài thay bạn”) |
| Copilot gợi ý đoạn code | GenAI / LLM | Tạo nội dung mới (code) |

### Việc BA/Tester hay nhờ LLM
- Đọc requirement, chỉ chỗ mơ hồ.
- Phác danh sách câu hỏi hỏi PO.
- Phác test case / test data (bản nháp).

### Việc LLM **không** thay bạn
- Quyết định rule nghiệp vụ đúng hay sai.
- Ký nhận “đã cover đủ” khi bạn chưa đọc.

### Bài tập nhỏ
Lấy 5 tool/tính năng trong công ty bạn (hoặc tool bạn dùng cá nhân). Với mỗi cái, viết một dòng:

> Đây là AI đoán/phân loại, hay AI tạo nội dung mới (GenAI/LLM)?

Không cần đúng thuật ngữ 100%. Cần giải thích được bằng lời của bạn.

### Mang đi
Khi ai nói “dùng AI đi”, bạn hỏi lại: **AI nào — đoán, phân loại, hay chatbot viết?**

---

## LESSON 2.2 — Hỏi thiếu thì trả lời “hay nhưng lệch”

### Câu chuyện mở đầu
Bạn gõ:

> Viết test case đăng nhập giúp tôi.

AI trả về rất chuyên nghiệp… nhưng nói đến **đăng nhập bằng QR**, **đăng nhập SSO Google**, **khóa tài khoản sau 5 lần sai**.  
App của bạn chỉ có **email + mật khẩu**. Không QR, không SSO.

Không phải AI “ghét” bạn. Nó **không biết app của bạn** — nên nó viết theo kiến thức chung.

### Ba thứ trong một lần hỏi

1. **Việc cần làm** — bạn muốn gì? (liệt kê câu hỏi / viết test case / tóm tắt…)  
2. **Bối cảnh** — app/rule/thông tin thật của bạn (dán vào, đừng chỉ nói “của team tôi”).  
3. **Dạng trả lời** — bảng, checklist, 5 gạch đầu dòng… để khỏi nhận một khối văn dài khó soi.

Gọi tắt cũng được: **việc – bối cảnh – dạng**.

*(Thuật ngữ hay gặp: việc ≈ prompt task, bối cảnh ≈ context. Không bắt buộc nhớ.)*

### Ví dụ đời thường

**Hỏi kém**
```text
Viết checklist kiểm thử form đăng ký.
```

**Hỏi rõ**
```text
Việc: Viết checklist kiểm thử form đăng ký.
Bối cảnh (chỉ dùng thông tin này):
- Có email, mật khẩu, nút Đăng ký.
- Email bắt buộc đúng định dạng.
- Mật khẩu tối thiểu 8 ký tự.
- Không có đăng ký bằng Google/Facebook.
Dạng trả lời: checklist ngắn, mỗi ý một dòng.
Không thêm tính năng ngoài danh sách trên.
```

Chạy hai câu. Gạch những ý chỉ xuất hiện ở câu hỏi kém.

### Vì sao đôi khi hỏi lại ra khác?
Cùng một câu, lần 1 và lần 2 có thể lệch nhau một chút. Bình thường.  
Vì vậy: **lưu câu hỏi + lưu câu trả lời**, đừng tin “lần trước nó đã nói vậy”.

### Bài tập nhỏ
1. Chọn một việc thật bạn đang làm (không cần lớn): viết mail báo bug, liệt kê câu hỏi requirement, checklist smoke một màn hình…  
2. Viết hai phiên bản hỏi: kém và rõ.  
3. Chạy cả hai, ghi 3 khác biệt.

### Mang đi
Trước khi bảo “AI dở”, hỏi lại: **mình đã đưa bối cảnh thật chưa?**

---

## LESSON 2.3 — Sai mà trông giống đúng (bài quan trọng nhất)

### Câu chuyện mở đầu
AI viết acceptance criteria rất mượt. Trong đó có câu:

> Nếu sai mật khẩu 3 lần, khóa tài khoản 15 phút.

Nghe chuẩn “best practice”.  
Nhưng tài liệu của bạn **không hề** nói vậy. Nếu bạn copy vào Confluence, team sẽ implement theo rule **không tồn tại**.

Đó là rủi ro số một khi BA/Tester dùng AI.

### Ba kiểu lệch hay gặp (nhớ ý, không cần thuộc tên)

1. **Bịa thêm** — thêm rule/tính năng không có trong tài liệu bạn đưa.  
2. **Suy luận lệch** — đọc đúng một phần rồi kết luận sai (ví dụ: “có timeout” → “cứ gọi lại mãi đến khi thành công”).  
3. **Lệch thói quen** — chỉ viết happy path quen thuộc, bỏ case bạn đang cần (lỗi mạng, quyền thiếu, dữ liệu trống…).

Tên tiếng Anh trên tài liệu chuyên ngành thường gọi là hallucination / reasoning error / bias. Ở đây chỉ cần nhớ: **bịa – lệch – thiên lệch**.

### Cách soi (làm tay, rất đơn giản)

Với **từng câu** AI viết, hỏi:

> Câu này lấy từ đâu trong tài liệu mình đã đưa?

- Chỉ được chỗ cụ thể → tạm chấp nhận (vẫn có thể cần hỏi PO làm rõ).  
- Không chỉ được → **bịa** → bỏ hoặc đánh dấu hỏi lại.  
- Chỉ được một phần nhưng kết luận khác → **lệch** → sửa.

“Nghe hợp lý” **không** được tính là đúng.

### Luyện nhanh
Giả sử tài liệu chỉ nói: *Form liên hệ có họ tên, email, nội dung, nút Gửi.*  
AI trả về checklist có:
- Bắt buộc captcha  
- Giới hạn 500 ký tự  
- Gửi được file đính kèm  

Cả ba đều “nghe hợp lý” — và cả ba đều **bịa** nếu tài liệu không nói.

### Bài chính — AI Challenge
1. Lấy **một đoạn tài liệu thật** bạn đang có (requirement, user story, chú thích Figma, mail PO… — che thông tin nhạy cảm nếu cần).  
2. Nhờ AI: “Liệt kê mọi quy tắc nghiệp vụ / điều kiện chấp nhận từ đoạn sau” (dán tài liệu).  
3. Soi **từng câu** bằng bảng:

| Câu của AI | Có trong tài liệu gốc? | Ghi chú | Kết luận (Đúng / Bịa / Lệch) |
|---|---|---|---|

4. Viết báo cáo ngắn ½–1 trang cho team (mẫu dưới).

### Mẫu báo cáo (giữ đơn giản)

```markdown
# Báo cáo giới hạn AI (Module 2)

- Công cụ:
- Ngày:
- Tài liệu mình đã đưa (mô tả ngắn, không cần dán secret):

## Số liệu
- Tổng câu AI viết:
- Đúng / Bịa / Lệch:

## AI viết ổn ở chỗ nào
-

## AI hay sai kiểu gì (ví dụ cụ thể)
-

## Việc không giao AI làm một mình
-

## Việc cho AI viết nháp, người duyệt
-
```

### Mang đi
Thói quen soi từng câu với nguồn gốc. Đây là kỹ năng sống còn — không phải “học thuộc AI”.

---

## Hết Module 2 — bạn đang có gì?

1. Cách phân biệt AI đoán / AI viết (LLM).  
2. Cách hỏi đủ: việc – bối cảnh – dạng trả lời.  
3. Một **báo cáo giới hạn AI** từ tài liệu thật của bạn.

**Module sau (Prompt + Context + Rule)** sẽ giúp bạn biến cách hỏi này thành bộ luật dùng lại được — để khỏi mỗi lần hỏi một kiểu, và để giảm bịa ngay từ đầu.
