# Tập 11 — Thêm AI vào app: tự phân loại khoản chi qua Telegram bot

Tiếp tập 10. App sổ chi tiêu đã ghi được khoản chi qua Telegram, nhưng người dùng muốn xem "tháng này ăn uống hết bao nhiêu". Tập này để một mô hình ngôn ngữ đề xuất nhóm cho mỗi khoản chi, với các lớp bảo vệ: kiểm tra nhãn trả về, hạn chót, ghi khoản chi trước khi hỏi AI, chỉ gửi phần ghi chú đã làm sạch, và kiểm tra secret_token của webhook.

**Lưu ý quan trọng:** mọi thứ chạy bằng "mô hình" GIẢ (`src/mo-hinh.ts`, bảy kiểu bắt chước cách mô hình thật hay trả lời), không cần khóa API hay mạng. Hàm `moHinhThat` gọi API Messages của Anthropic nhưng KHÔNG được chạy trong bài. Mọi tên, số tiền và token là minh họa.

- `src/doc-khoan-chi.ts`: bản đọc khoản chi rút gọn ("cà phê 35k" thành ghi chú và số tiền).
- `src/phan-loai.ts`: danh sách nhóm, câu lệnh cho mô hình, làm sạch ghi chú, kiểm tra câu trả lời, hạn chót, bộ nhớ nhãn.
- `src/mo-hinh.ts`: mô hình giả (7 kiểu) và `moHinhThat`.
- `src/bot.ts`: bot grammY 1.46.0 và `taoWebhook` (kiểm tra `secret_token`).
- `src/thu-bot.ts`: đồ nghề thử bot không cần token hay mạng.
- `thu-ban-dau.ts`: cách làm đầu tiên (sai). `thu-phan-loai.ts`: bảy kiểu mô hình đi qua phần kiểm tra. `thu-bot.ts`: nhắn vài tin khi AI tốt và khi AI lỗi. `thu-webhook.ts`: ba yêu cầu giả tới webhook.
- `src/phan-loai.test.ts`: 11 test.

```bash
npm install
node thu-ban-dau.ts
node thu-phan-loai.ts
node thu-bot.ts
node thu-webhook.ts
node --test src/phan-loai.test.ts
```

Cần Node.js 22.18+ (chạy thẳng file .ts).
