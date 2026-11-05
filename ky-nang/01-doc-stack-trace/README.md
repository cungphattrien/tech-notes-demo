# Tập 1 — Đọc stack trace

Trạng thái sau khi sửa lỗi "trang đơn hàng bị sập".

- Lỗi: `TypeError: Cannot read properties of undefined (reading 'name')` ở `customerLabel`.
- Nguyên nhân: đơn nhập từ máy bán hàng cũ (`source: "may-cu"`) bán tại quầy, không có `customer`, trong khi kiểu `Order` khai báo `customer` luôn có.
- Cách sửa: sửa kiểu cho đúng dữ liệu thật (`customer?`) và hiển thị "KHÁCH TẠI QUẦY".

```bash
node src/server.ts
# http://localhost:3000/don-hang → 200
```

Còn một vấn đề: nhìn kỹ tổng tiền đơn 1044. Đọc tiếp tập 2.
