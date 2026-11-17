# Tập 5: Spring Boot auto-configuration, application.yml và profile

Series: Học Spring Boot: xây API đặt hàng từ con số 0. Bài viết: xem trên blog Tech Notes, mục series `hoc-spring-boot`.

Tiếp tục `order-api` của tập 4 (`../04-spring-ioc-di/`, Spring Boot 4.1.2, Java 25). Quy tắc giảm giá của quán Mộc (dữ liệu minh họa, xem `../../DOMAIN.md`) giờ nằm trong cấu hình thay vì viết cứng trong code.

## Thay đổi so với tập 4

- Bỏ `application.properties` và `InDanhSachBean`; thêm `application.yml`, `application-dev.yml`, `application-prod.yml`.
- `MocProperties`: gom thiết lập `moc.giam-gia.*` thành một đối tượng có kiểu (`@ConfigurationProperties`).
- `GiamGiaService` và `GiamGiaController`: `GET /giam-gia?tong=...` trả tiền giảm theo quy tắc đang cấu hình.
- `JsonDepConfig`: chỉ bật với profile `json-dep`, tự khai báo `JsonMapper` để thấy auto-configuration lùi lại.

## Cần gì

JDK 17 trở lên (đã thử với Eclipse Temurin 25.0.5), Maven 3.9 hoặc `./mvnw`.

## Chạy

```bash
mvn package
java -Dstdout.encoding=UTF-8 -jar target/order-api-0.0.1-SNAPSHOT.jar
curl "http://localhost:8080/giam-gia?tong=170000"

# profile dev (cổng 8081, giảm 15%)
java -Dstdout.encoding=UTF-8 -jar target/order-api-0.0.1-SNAPSHOT.jar --spring.profiles.active=dev

# biến môi trường ghi đè file yml (Linux/macOS/Git Bash)
MOC_GIAMGIA_PHANTRAM=20 java -Dstdout.encoding=UTF-8 -jar target/order-api-0.0.1-SNAPSHOT.jar --spring.profiles.active=dev --server.port=8082

# tham số dòng lệnh ghi đè tất cả
java -Dstdout.encoding=UTF-8 -jar target/order-api-0.0.1-SNAPSHOT.jar --moc.giam-gia.phan-tram=25

# xem báo cáo auto-configuration
java -Dstdout.encoding=UTF-8 -jar target/order-api-0.0.1-SNAPSHOT.jar --debug

# JSON in đẹp nhờ bean JsonMapper tự khai báo
java -Dstdout.encoding=UTF-8 -jar target/order-api-0.0.1-SNAPSHOT.jar --spring.profiles.active=json-dep
```

Profile `prod` dùng cổng 80, nên chỉ chạy được khi cổng đó trống và bạn có quyền.
