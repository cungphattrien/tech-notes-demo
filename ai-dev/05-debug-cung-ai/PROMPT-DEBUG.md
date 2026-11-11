# Prompt debug cho lỗi "/tong cộng cả khoản của người khác"

Mẫu chung: bối cảnh → lỗi → cách tái hiện → kết quả thật → kết quả mong muốn → code liên quan → đã loại trừ → yêu cầu.

```
Bối cảnh: bot Telegram ghi chi tiêu, TypeScript chạy thẳng bằng Node 22 (không build), grammY 1.46.0.
Spec (SPEC.md v1.2): mỗi người dùng nhắn khoản chi cho bot; /tong trả tổng tháng này của NGƯỜI ĐÓ.

Lỗi: khi có hai người cùng nhắn cho bot, /tong của người này cộng cả khoản chi của người kia.

Tái hiện (không cần token): TZ=UTC node hai-nguoi-dung.ts
<dán nội dung hai-nguoi-dung.ts>

Kết quả thật:
Mình (id 42) nhắn "cà phê 35k" → Đã ghi: cà phê, 35.000đ
Bạn mình (id 77) nhắn "trà sữa 32k" → Đã ghi: trà sữa, 32.000đ
Mình (id 42) nhắn "/tong" → Tháng 12/2026: 2 khoản, tổng 67.000đ

Kết quả mong muốn ở dòng cuối: Tháng 12/2026: 1 khoản, tổng 35.000đ

Code liên quan:
<dán src/bot.ts>
<dán src/chay-bot.ts>
<dán src/so-chi-tieu.ts>

Đã loại trừ:
- parseExpense đọc đúng số tiền: 16 test xanh.
- tongThang tính đúng với một người: 7 test trong so-chi-tieu.test.ts xanh.

Yêu cầu:
1. Chỉ ra nguyên nhân, trích đúng file và dòng. Chưa sửa code.
2. Đề xuất 2 cách sửa. Với mỗi cách: những file nào phải đổi, test nào phải sửa, và nơi nào khác đang gọi
   hàm bị đổi chữ ký.
```
