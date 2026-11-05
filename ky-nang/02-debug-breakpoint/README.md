# Tập 2 — Debug bằng breakpoint trong VS Code

Trạng thái sau khi sửa lỗi "đơn 1044 tổng 70 đồng".

- Triệu chứng: không có lỗi, trang trả về 200, nhưng đơn 1044 (2 ly cà phê muối) có `tong: 70`.
- Nguyên nhân: máy bán hàng cũ ghi giá dạng chuỗi `"35.000"`. JavaScript tự đổi chuỗi này thành số khi nhân, và đọc dấu chấm là dấu thập phân: `"35.000" * 2 === 70`.
- `console.log(item.price)` in ra `35.000` không có dấu nháy, nên rất khó nhận ra đây là chuỗi. Breakpoint cho thấy ngay kiểu dữ liệu.
- Cách sửa: chuẩn hóa dữ liệu ngay khi đọc file (`normalizeOrder`, `parsePrice` trong `src/orders.ts`). Định dạng giá lạ thì báo lỗi, không đoán.

Muốn tự debug lỗi: mở thư mục `01-doc-stack-trace` trong VS Code, đặt breakpoint ở dòng 18 của `src/orders.ts`
(trong `orderTotal`), rồi chạy `node src/server.ts` trong **JavaScript Debug Terminal**
(Command Palette → "Debug: Create JavaScript Debug Terminal"), hoặc dùng `.vscode/launch.json` có sẵn ở thư mục này (F5).

```bash
node src/server.ts
# http://localhost:3000/don-hang → đơn 1044: "tong": 70000
```

Còn lại: sửa xong rồi, nhưng làm sao chứng minh và giữ cho lỗi không quay lại? Tập 3 viết test với Vitest.
