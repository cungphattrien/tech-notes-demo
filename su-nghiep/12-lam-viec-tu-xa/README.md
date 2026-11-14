# Tập 12 — Làm việc remote và giao tiếp bất đồng bộ

Mọi chi tiết về Minh, công ty A, anh Phúc, chị Hạnh, anh Karl, pull request, đường dẫn và tin nhắn là minh họa (tên miền `.example`). Tiếp tập 11: cả nhóm làm từ xa ba ngày mỗi tuần, người kia không còn ngồi cạnh để trả lời ngay.

- `tin-nhan-xau.txt`: tin nhắn nhờ việc kiểu "anh rảnh chưa ạ".
- `tin-nhan-tot.txt`: tin nhắn nhờ việc người đọc làm được ngay dù đọc sau vài giờ, ở múi giờ khác.
- `kiem-tin-nhan.ts`: kiểm năm phần (không xin phép trước, có bối cảnh, nói rõ điều cần, hạn có giờ và múi giờ, nói trong lúc chờ làm gì). Chỉ kiểm sự có mặt bằng từ khóa.
- `doi-nhom.json`: bốn người, bốn múi giờ (Việt Nam, Singapore, Berlin), mỗi người làm 09:00–18:00 giờ của mình.
- `gio-trung.ts`: tìm khung giờ cả nhóm cùng làm việc vào một ngày, có tính giờ mùa hè.
- `lam-viec-tu-xa.test.ts`: 12 test, gồm một test ghi lại giới hạn đã biết của bộ kiểm tin nhắn.

```bash
node kiem-tin-nhan.ts tin-nhan-xau.txt     # 0/5
node kiem-tin-nhan.ts tin-nhan-tot.txt     # 5/5
node gio-trung.ts doi-nhom.json 2026-12-14   # trùng 120 phút
node gio-trung.ts doi-nhom.json 2027-07-12   # Berlin đổi giờ: trùng 180 phút
node --test lam-viec-tu-xa.test.ts
```

Cần Node.js 22.18+ (chạy thẳng file .ts, không cần cài gì).
