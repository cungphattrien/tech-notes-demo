# Tập 6: JUnit cơ bản, viết test đầu tiên cho code Java

Series: Học Java từ đầu cho người làm backend. Bài viết: xem trên blog Tech Notes, mục series `hoc-java-cho-backend`.

Đi từ tập 4–5 (`../05-debug-stack-trace/`): giữ `App` và `TinhDon` (tính tiền cho quán Mộc, dữ liệu minh họa, xem `../../DOMAIN.md`), bỏ các class tập debug, thêm test tự động bằng JUnit.

## Thay đổi so với tập 5

- `pom.xml`: thêm `junit-jupiter` 6.1.3 (scope `test`) và khai báo `maven-surefire-plugin` 3.6.1.
- `TinhDon.tinhTongTien`: báo `IllegalArgumentException` khi hai mảng lệch độ dài.
- `KiemTraBangTay.java`: cách kiểm tra bằng `main` và `println`, để so với JUnit.
- `src/test/java/vn/moc/donhang/TinhDonTest.java`: 4 test thường và 1 test tham số hóa (5 bộ dữ liệu), tổng 9 lần chạy.

## Cần gì

JDK 25 và Maven 3.9 trở lên (đã thử với Eclipse Temurin 25.0.5 và Maven 3.10.1). JUnit 6 cần Java 17 trở lên.

## Chạy

```bash
mvn test                                    # chạy test: Tests run: 9, Failures: 0
mvn test -Dtest=TinhDonTest#donDungNguongDuocGiam   # chỉ chạy một test
java -Dstdout.encoding=UTF-8 -cp target/classes vn.moc.donhang.KiemTraBangTay
```

## Tự tạo lại các lỗi trong bài

- Đổi `>=` thành `>` trong `TinhDon.tinhGiamGia`: `mvn test` báo 2 test hỏng và `BUILD FAILURE`; `KiemTraBangTay` in `SAI` nhưng vẫn thoát với mã 0.
- Đổi tên `TinhDonTest` thành `KiemTraTinhDon`: Surefire không nhận ra class test, không chạy test nào mà vẫn `BUILD SUCCESS`.
- Chuyển file test sang `src/main/java`: `mvn compile` báo `package org.junit.jupiter.api does not exist` vì JUnit chỉ có ở scope `test`.
