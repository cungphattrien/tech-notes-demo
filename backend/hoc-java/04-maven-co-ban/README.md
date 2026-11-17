# Tập 4: Maven cơ bản, cấu trúc project Java và pom.xml

Series: Học Java từ đầu cho người làm backend. Bài viết: xem trên blog Tech Notes, mục series `hoc-java-cho-backend`.

Đây là project Maven nhỏ in phiếu tính tiền cho quán Mộc (dữ liệu minh họa, xem `../../DOMAIN.md`). Code tính tiền lấy từ tập 3, đặt trong package `vn.moc.donhang`.

## Các file

- `pom.xml`: khai báo project (nhóm, tên, phiên bản), Java 25 và một thư viện (Apache Commons Lang 3.22.0).
- `src/main/java/vn/moc/donhang/TinhDon.java`: `tinhTongTien` và `tinhGiamGia`.
- `src/main/java/vn/moc/donhang/App.java`: in phiếu tính tiền, dùng `StringUtils` của Commons Lang để căn cột.

## Cần gì

JDK 25 và Maven 3.9 (đã thử với Eclipse Temurin 25.0.5 và Maven 3.9.16).

## Chạy

```bash
mvn package                       # biên dịch và đóng gói target/don-hang-1.0.0.jar
java -jar target/don-hang-1.0.0.jar   # báo "no main manifest attribute": chủ ý, xem bài

mvn dependency:copy-dependencies  # chép thư viện vào target/dependency
# Linux/macOS dùng dấu ":" thay cho ";" trong classpath
java -Dstdout.encoding=UTF-8 -cp "target/classes;target/dependency/*" vn.moc.donhang.App
mvn dependency:tree               # cây thư viện của project
```

Hai lỗi trong bài tự tạo lại bằng cách: chuyển `src/main/java` thành `src/main` (Maven báo `No sources to compile` mà vẫn BUILD SUCCESS), hoặc đổi `commons-lang3` thành `commons-lang` trong `pom.xml` (không tìm thấy artifact).
