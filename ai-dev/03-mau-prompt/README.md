# Tập 3 — 7 mẫu prompt viết code dùng hằng ngày

- `PROMPTS.md` — 7 mẫu prompt, mỗi mẫu kèm việc tự kiểm tra.
- `SPEC.md` — v1.2: tin nhắn bắt đầu bằng `/` là lệnh (`/tong tháng 10` từng bị ghi thành khoản chi 10đ), `/tổng` có dấu cũng được.
- `src/so-chi-tieu.ts` — dùng lại một `Intl.DateTimeFormat` thay vì tạo mới mỗi lần, bỏ dấu `!`, xử lý lệnh.
- `src/so-chi-tieu.test.ts` — 7 test (5 cũ + 2 mới); `src/parse-expense.test.ts` — 16 test, không đổi.
- `do-toc-do.ts` — đo 10.000 lần tính tháng: tạo formatter mỗi lần so với dùng lại một formatter.

```bash
TZ=UTC node src/so-chi-tieu.test.ts
TZ=UTC node src/parse-expense.test.ts
node do-toc-do.ts
```

Cần Node.js 22.18+. Chạy test với `TZ=UTC` để giống máy chủ thật.

Còn lại: muốn nhắn tin thật qua Telegram thì cần một thư viện mình chưa dùng bao giờ. Tập 4: dùng AI để đọc hiểu thư viện lạ.
