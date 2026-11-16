# Tập 2: SQL cơ bản, CRUD và JOIN cho dữ liệu đơn hàng

Series: Học Spring Boot: xây API đặt hàng từ con số 0. Bài viết: xem trên blog Tech Notes, mục series `hoc-spring-boot`.

Dùng miền chung ở `../../DOMAIN.md`: bảng `menu_items`, `orders`, `order_lines`.

## Các file

- `schema.sql`: tạo ba bảng.
- `du-lieu-mau.sql`: 5 món, 6 đơn (đơn số 6 chưa có dòng món nào, để thấy khác biệt giữa JOIN và LEFT JOIN) và 8 dòng món.
- `bai-1-select.sql`, `bai-2-ghi.sql`, `bai-3-join.sql`: các câu lệnh của bài.
- `chay-sql.mjs`: chạy một file `.sql` trên PostgreSQL bằng PGlite (PostgreSQL chạy trong Node, không cần cài database) và in kết quả theo kiểu `psql`.

## Cần gì

Node.js 22 trở lên. Chạy `npm install` một lần để cài PGlite 0.3.14.

## Chạy

```bash
npm install
node chay-sql.mjs bai-1-select.sql
node chay-sql.mjs bai-2-ghi.sql
node chay-sql.mjs bai-3-join.sql
```

Mỗi lần chạy tạo một database mới trong bộ nhớ, nạp `schema.sql` và `du-lieu-mau.sql`, nên kết quả luôn giống nhau.

## Muốn dùng PostgreSQL thật

Các câu lệnh SQL chạy y nguyên trên PostgreSQL cài sẵn (ví dụ bằng `psql -f schema.sql`, rồi `psql -f du-lieu-mau.sql`, rồi từng file bài). Cách trình bày kết quả của `psql` gần giống với `chay-sql.mjs`.
