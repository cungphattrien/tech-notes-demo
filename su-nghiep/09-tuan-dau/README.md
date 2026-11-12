# Tập 9 — Tuần đầu đi làm

Mọi chi tiết về Minh, công ty A, anh Phúc, chị Hạnh, ngày làm việc và nhật ký là minh họa. Tiếp tập 8: Minh đã ký thư mời, ngày đi làm đầu tiên là 01/12/2026.

- `moc-thoi-gian.ts` — bản đồ 60 ngày thử việc (01/12/2026 đến 29/01/2027): ngày thứ N là ngày nào, thứ mấy, và có bao nhiêu ngày làm việc thật sự.
- `kiem-may.ts` — kiểm tra máy đã sẵn sàng chưa (Node.js, Git, danh tính Git, khóa SSH); chỉ in ✓/✗, không in giá trị cá nhân.
- `nhat-ky-ngay.md` — mẫu nhật ký cuối ngày.
- `tinh-toan.test.ts` — 6 test.

```bash
node moc-thoi-gian.ts
node kiem-may.ts
node --test tinh-toan.test.ts
```

Cần Node.js 22.18+ (chạy thẳng file .ts, không cần cài gì). Kết quả của `kiem-may.ts` phụ thuộc máy của bạn.
