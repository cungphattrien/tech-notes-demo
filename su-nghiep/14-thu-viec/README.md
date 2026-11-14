# Tập 14 — Hết 2 tháng thử việc: tự đánh giá và lộ trình năm đầu

Mọi chi tiết về Minh, anh Phúc, chị Hạnh, anh Karl, các PR, ngày tháng và số giờ trong thư mục này là **minh họa** (tên miền `.example`, không có công ty thật). Tiếp tập 13: sắp hết hai tháng thử việc, và Minh muốn tự đánh giá mình bằng bằng chứng trước khi người khác đánh giá.

- `ghi-chu.json`: sổ ghi chú công việc 8 tuần của Minh (12 ghi chú), mỗi ghi chú gắn với một hoặc nhiều năng lực, có bằng chứng và kết quả.
- `tu-danh-gia.ts`: `thongKe` (mỗi năng lực có bao nhiêu bằng chứng, năng lực nào chưa có) và `kiemTuDanhGia` (một bản tự đánh giá có đủ năm phần, có bằng chứng đi kèm, và không dùng tính từ suông). Chỉ kiểm sự có mặt bằng từ khóa và mẫu bằng chứng, **không hiểu nội dung**.
- `tu-danh-gia-xau.md`, `tu-danh-gia-tot.md`: hai bản để so sánh.
- `tu-danh-gia.test.ts`: 12 test, gồm một test ghi lại giới hạn đã biết.

```bash
node tu-danh-gia.ts thong-ke
node tu-danh-gia.ts kiem tu-danh-gia-xau.md
node tu-danh-gia.ts kiem tu-danh-gia-tot.md
node --test tu-danh-gia.test.ts
```

Cần Node.js 22.18+. Không cần `npm install`. Danh sách bảy năng lực là giả định của nhóm minh họa; nhóm của bạn sẽ có danh sách khác.
