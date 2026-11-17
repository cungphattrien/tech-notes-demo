# Tập 5: Debug Java và đọc stack trace

Series: Học Java từ đầu cho người làm backend. Bài viết: xem trên blog Tech Notes, mục series `hoc-java-cho-backend`.

Project Maven của tập 4 (`../04-maven-co-ban/`, tính tiền và in phiếu cho quán Mộc, dữ liệu minh họa) cộng thêm ba class để tập debug.

## Các file thêm

- `GiamGiaLoi.java`: **có lỗi logic cố ý**. Giảm giá theo từng dòng thay vì theo tổng đơn: đơn của Mai ra 156500 thay vì 153000.
- `GiamGiaDung.java`: bản đã sửa, dùng lại `TinhDon`.
- `InPhieuLoi.java`: **cố tình sập** với `NullPointerException` bọc trong `IllegalStateException`, để tập đọc stack trace.

## Cần gì

JDK 25 và Maven 3.9 (đã thử với Eclipse Temurin 25.0.5 và Maven 3.9.16).

## Chạy

```bash
mvn package
java -Dstdout.encoding=UTF-8 -cp target/classes vn.moc.donhang.GiamGiaLoi
java -Dstdout.encoding=UTF-8 -cp target/classes vn.moc.donhang.GiamGiaDung
java -Dstdout.encoding=UTF-8 -Dstderr.encoding=UTF-8 -cp target/classes vn.moc.donhang.InPhieuLoi   # báo lỗi, đây là chủ ý
```

## Debug bằng jdb (trình debug dòng lệnh đi kèm JDK)

```bash
jdb -classpath target/classes vn.moc.donhang.GiamGiaLoi
> stop at vn.moc.donhang.GiamGiaLoi:13     # đặt breakpoint ở dòng 13
> run
main[1] locals                             # xem biến cục bộ
main[1] print thanhTien
main[1] where                              # xem ngăn xếp gọi method
main[1] cont                               # chạy tiếp tới breakpoint kế
```

`mvn package` biên dịch kèm thông tin debug (tên biến, số dòng) theo mặc định, nên `locals` thấy tên biến.
