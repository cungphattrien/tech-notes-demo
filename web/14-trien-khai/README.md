# Tập 14 — Deploy blog lên Vercel: biến môi trường, preview, rollback

Tiếp tập 13. Code đã qua CI, nhưng chưa tới tay người đọc. Tập này không deploy gì mới: nó viết hai script kiểm trước và sau khi deploy, rồi chạy chúng trên blog Tech Notes thật (repo `tech-notes`, đã deploy lên Vercel).

**Lưu ý quan trọng:**
- `kiem-env.ts` chạy trên repo blog cho kết quả thật (không thiếu biến nào). Các test dùng dữ liệu giả để chứng minh script bắt được lỗi.
- `kiem-sau-deploy.ts` được chạy trên (1) bản build `next build && next start` ở máy mình (không đặt `VERCEL_ENV`, nên hành xử như preview), và (2) trang production thật bằng vài yêu cầu GET. Mình **không** thử rollback và không có địa chỉ preview thật của Vercel.

- `kiem-env.ts` (+ test): so biến môi trường code dùng với `.env.example`. Chỉ thấy `process.env.TEN` và `env.TEN`.
- `kiem-sau-deploy.ts` (+ test): vài trang chính trả 200, có `<title>`; production không noindex và không trỏ về localhost; preview noindex.
- Tổng cộng 16 test.

```bash
node kiem-env.ts ../../../tech-notes                    # đường dẫn tới repo blog của bạn
node kiem-sau-deploy.ts http://localhost:3400 preview   # sau: npm run build && npx next start -p 3400 trong repo blog
node kiem-sau-deploy.ts https://www.technotes.asia production
node --test kiem-env.test.ts kiem-sau-deploy.test.ts
```

Cần Node.js 22.18+. Không cần `npm install`.
