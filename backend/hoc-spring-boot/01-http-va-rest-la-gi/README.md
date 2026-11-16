# Tập 1: HTTP và REST là gì, gọi API đầu tiên

Series: Học Spring Boot: xây API đặt hàng từ con số 0. Bài viết: xem trên blog Tech Notes, mục series `hoc-spring-boot`.

Tập này dùng dạng rút gọn của đơn hàng (`id`, `customer`, `item`, `quantity`), xem `../../DOMAIN.md`.

## Các file

- `OrderServer.java`: một API đơn hàng nhỏ chỉ dùng JDK (không framework): xem danh sách, xem một đơn, tạo đơn, xóa đơn.
- `thu-api.sh`: các lệnh `curl` gọi thử từng trường hợp (thành công, không thấy, thiếu dữ liệu, sai phương thức).
- `don-moi.json`, `don-thieu.json`, `sua-don.json`: nội dung gửi lên, lưu bằng UTF-8.

## Cần gì

JDK 25 (đã thử với Eclipse Temurin 25.0.5 trên Windows 11) và `curl`.

## Chạy

Mở hai cửa sổ dòng lệnh trong thư mục này.

```bash
# Cửa sổ 1: bật server (cổng 8080)
java -Dstdout.encoding=UTF-8 OrderServer.java

# Cửa sổ 2: gọi thử
bash thu-api.sh
```

Server giữ dữ liệu trong bộ nhớ: tắt đi bật lại thì danh sách về như ban đầu (đơn của Lan và Hùng).

## Lưu ý trên Windows

Gõ chữ tiếng Việt thẳng trên dòng lệnh `curl` có thể làm vỡ chữ (hệ điều hành truyền tham số theo bảng mã khác). Vì vậy nội dung gửi lên nằm trong file `.json` UTF-8 và dùng `-d @tên-file`.
