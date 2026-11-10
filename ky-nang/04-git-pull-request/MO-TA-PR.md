fix: đọc đúng giá dạng "35.000" của máy bán hàng cũ

## Vấn đề
Đơn 1044 (2 ly cà phê muối) hiện tổng 70 đồng thay vì 70.000 đồng.
Máy bán hàng cũ ghi giá là chuỗi "35.000". JavaScript đọc dấu chấm thành dấu thập phân, nên "35.000" * 2 = 70.

## Thay đổi
- `parsePrice` đổi giá về số ngay khi đọc dữ liệu, qua `normalizeOrder` trong `server.ts`.
- Định dạng lạ ("35,000", "35k", chuỗi rỗng) báo lỗi thay vì đoán.
- Thêm Vitest và 11 test, trong đó có test riêng cho đơn 1044.

## Cách kiểm tra
1. `npm install && npm test`: 11 test xanh.
2. `node src/server.ts`, mở http://localhost:3000/don-hang: đơn 1044 có `"tong": 70000`.

## Chưa làm trong PR này
- Chưa kiểm tra dữ liệu đơn hàng lúc nhận từ máy cũ (số lượng âm, thiếu tên món).
- Nếu `orders.json` có một giá sai định dạng, máy chủ dừng ngay lúc khởi động. Mình muốn hỏi ý kiến: nên dừng, hay bỏ qua đơn đó và ghi log?
