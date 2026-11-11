# Tập 6: Đặt tên và tách hàm, refactor an toàn nhờ có test

Dọn `server.ts` của hệ thống đơn hàng Mộc theo ghi chú review của anh Khoa (nhân vật minh họa),
mà không đổi hành vi.

- `ban-dau/`: `server.ts` và `orders.ts` trước khi dọn.
- `src/server.test.ts`: test đặc tả, viết TRƯỚC khi dọn, chạy xanh trên cả code cũ lẫn code mới.
- `src/order-file.ts`, `src/order-server.ts`, `src/server.ts`: code sau khi tách.
- `src/order-file.test.ts`, `src/order-server.test.ts`: test chỉ viết được sau khi tách.
- `lam-lai-cac-commit.sh <thư-mục>`: dựng kho Git thử và tạo lại bốn commit theo thứ tự trong bài.

```bash
npm ci
npx vitest run src      # 4 file, 22 test
node src/server.ts      # http://localhost:3000/don-hang
```

Cần Node.js 22.18+ (chạy thẳng file .ts).
