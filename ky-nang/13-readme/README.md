# Đơn hàng Mộc

Máy chủ nhận và trả danh sách đơn hàng của quán cà phê Mộc (nhân vật minh họa). Website của quán gửi đơn mới tới đây; nhân viên xem danh sách qua `GET /don-hang`.

## Cần có

- Node.js 22.18 trở lên (kiểm tra bằng `node --version`). Dự án chạy thẳng file `.ts`, và dùng `--env-file` để đọc `.env`, nên Node cũ hơn sẽ lỗi.
- npm (đi kèm Node.js).

## Chạy lần đầu

```bash
npm install
npm run setup    # tạo .env từ .env.example, điền sẵn một ORDER_API_KEY ngẫu nhiên
npm start        # máy chủ lắng nghe ở http://localhost:3000
```

Mở `http://localhost:3000/don-hang` trong trình duyệt. Bạn sẽ thấy danh sách hai đơn hàng mẫu (JSON). Thấy vậy là xong.

## Chạy test

```bash
npm test
```

Kết quả đúng: 23 test, tất cả `pass`.

## Cấu hình

Mọi cấu hình đọc từ biến môi trường, và `.env.example` mô tả từng biến cùng giá trị mặc định. Chỉ có `ORDER_API_KEY` là bắt buộc; `npm run setup` đã điền giúp bạn. File `.env` không được commit.

## Cấu trúc thư mục

- `src/server.ts`: máy chủ.
- `src/config.ts`: đọc và kiểm tra biến môi trường (mọi chỗ khác dùng `config`, không đọc `process.env`).
- `data/orders.json`: dữ liệu đơn hàng mẫu.
- `scripts/setup.ts`: tạo `.env`.

## Gặp lỗi?

- `node: .env: not found`: bạn chưa chạy `npm run setup`.
- `Cấu hình sai, máy chủ không khởi động:` rồi một danh sách: đọc từng dòng, mỗi dòng nói biến nào sai và vì sao. Sửa trong `.env`.
- `Error: listen EADDRINUSE: address already in use`: cổng 3000 đang có chương trình khác dùng. Đổi `PORT` trong `.env` (ví dụ `PORT=3001`).
