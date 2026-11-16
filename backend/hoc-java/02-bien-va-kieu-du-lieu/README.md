# Tập 2: Biến và kiểu dữ liệu trong Java

Series: Học Java từ đầu cho người làm backend. Bài viết: xem trên blog Tech Notes, mục series `hoc-java-cho-backend`.

## Các file

- `BangKieuDuLieu.java`: in kích thước và giá trị lớn nhất, nhỏ nhất của các kiểu số.
- `DonDauTien.java`: lưu một đơn hàng của quán Mộc vào các biến (xem `../../DOMAIN.md`).
- `SaiSoKieuDuLieu.java`: bốn lỗi hay gặp: `int` tràn số, `double` làm sai tiền, chia số nguyên, ép kiểu.
- `TienVoiBigDecimal.java`: `BigDecimal` cho tiền, và cạm bẫy `new BigDecimal(0.1)`.
- `LoiBienDich.java`: **cố tình không biên dịch được**, để xem thông báo lỗi.

## Cần gì

JDK 25 (đã thử với Eclipse Temurin 25.0.5).

## Chạy

```bash
java -Dstdout.encoding=UTF-8 BangKieuDuLieu.java
java -Dstdout.encoding=UTF-8 DonDauTien.java
java -Dstdout.encoding=UTF-8 SaiSoKieuDuLieu.java
java -Dstdout.encoding=UTF-8 TienVoiBigDecimal.java
javac LoiBienDich.java        # báo lỗi, đây là chủ ý
```

Cờ `-Dstdout.encoding=UTF-8` giúp chữ tiếng Việt in đúng trên Windows (xem tập 1).
