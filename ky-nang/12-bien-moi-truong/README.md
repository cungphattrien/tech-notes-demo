# Tập 12 — Biến môi trường và cấu hình: hết cảnh "máy em chạy mà"

Tiếp tập 11. Anh Khoa kéo `main` về, chạy thử thì lỗi trong khi máy bạn chạy ngon. Tập này làm một máy chủ đơn hàng nhỏ đọc cấu hình từ biến môi trường theo hai cách: đọc thẳng `process.env` (ra năm lỗi hay gặp), rồi gom vào `src/config.ts` có kiểm tra bằng Zod, dùng file `.env` qua `node --env-file`.

Khóa API trong demo là chuỗi giả. Không có file `.env` nào được commit; chỉ có `.env.example`.

- `src/server-ngay-tho.ts`: bản đầu, đọc `process.env` ở khắp nơi.
- `src/config.ts`: đọc, kiểm tra, đổi kiểu cấu hình một lần; sai thì dừng và liệt kê hết.
- `src/server.ts`: máy chủ dùng `config.ts`.
- `.env.example`: danh sách biến, ý nghĩa và mặc định.
- `src/config.test.ts`: 12 test.

```bash
npm install
node src/server-ngay-tho.ts          # thử các lỗi: PORT=abc, PORT=, LOG_REQUESTS=false, thiếu khóa
cp .env.example .env                 # rồi điền ORDER_API_KEY
npm start                            # node --env-file=.env src/server.ts
node --test src/config.test.ts
```

Cần Node.js 22.18+ (chạy thẳng file .ts, và `--env-file`). Cú pháp đặt biến trên PowerShell: `$env:PORT = "abc"`.
