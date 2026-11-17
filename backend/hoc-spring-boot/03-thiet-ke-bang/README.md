# Tập 3: Thiết kế bảng cho đơn hàng: khóa, quan hệ và chuẩn hóa

Series: Học Spring Boot: xây API đặt hàng từ con số 0. Bài viết: xem trên blog Tech Notes, mục series `hoc-spring-boot`.

Dùng miền chung ở `../../DOMAIN.md`. So với tập 2, `order_lines` có thêm cột `unit_price` (giá lúc đặt), khóa ngoại `ON DELETE CASCADE`, chỉ mục cho `menu_item_id`, và tên món là duy nhất.

## Các file

- `bang-phang.sql`: bảng "nhét hết vào một" `don_hang_phang`, dùng cho bài 1 (chủ ý thiết kế dở).
- `bai-1-loi-bang-phang.sql`: ba lỗi của bảng phẳng: sửa sót dòng, không thêm được món mới, xóa đơn mất luôn món.
- `schema.sql`, `du-lieu-mau.sql`: ba bảng đã thiết kế lại và dữ liệu mẫu (5 món, 6 đơn, 8 dòng món).
- `bai-2-gia-luc-dat.sql`: vì sao `order_lines` phải lưu `unit_price`.
- `bai-3-khoa-va-rang-buoc.sql`: khóa chính kép, khóa ngoại, UNIQUE, `ON DELETE CASCADE`, chỉ mục.
- `chay-sql.mjs`: chạy file `.sql` bằng PGlite (PostgreSQL chạy trong Node). Các file đứng trước file cuối chỉ nạp bảng và dữ liệu; file cuối được in từng câu.

## Cần gì

Node.js 22 trở lên. Chạy `npm install` một lần để cài PGlite 0.3.14.

## Chạy

```bash
npm install
node chay-sql.mjs bang-phang.sql bai-1-loi-bang-phang.sql
node chay-sql.mjs schema.sql du-lieu-mau.sql bai-2-gia-luc-dat.sql
node chay-sql.mjs schema.sql du-lieu-mau.sql bai-3-khoa-va-rang-buoc.sql
```

Mỗi lần chạy tạo một database mới trong bộ nhớ, nên kết quả luôn giống nhau. Các câu SQL chạy y nguyên trên PostgreSQL cài sẵn.
