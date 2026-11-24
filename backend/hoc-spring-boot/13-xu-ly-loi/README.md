# Tập 13: Xử lý lỗi toàn cục trong Spring Boot, @RestControllerAdvice và ProblemDetail

Series: Học Spring Boot: xây API đặt hàng từ con số 0. Bài viết: xem trên blog Tech Notes, mục series `hoc-spring-boot`.

Tiếp tục `order-api` của tập 12 (`../12-lombok-mapstruct/`, Spring Boot 4.1.2, Java 25). Dữ liệu quán Mộc là minh họa.

## Thay đổi so với tập 12

- Package `loi`: `KhongTimThayException` (404), `MonKhongTonTaiException` (422), và `XuLyLoiToanCuc` (`@RestControllerAdvice extends ResponseEntityExceptionHandler`) đổi mọi lỗi thành ProblemDetail (`application/problem+json`), kèm `requestId` lấy từ MDC.
- `XuLyLoiToanCuc` xử lý: validation (400 kèm `errors`), món không tồn tại (422), `sort` sai (400), vi phạm UNIQUE hoặc khóa ngoại (409, đổi tên ràng buộc thành câu báo), lỗi còn lại (500, ghi stack trace vào log, client chỉ nhận câu chung).
- `messages.properties`: câu báo tiếng Việt cho các lỗi chuẩn của Spring MVC.
- Controller ném `KhongTimThayException` thay vì trả 404 rỗng; `OrderService` ném `MonKhongTonTaiException`.
- DTO: thông báo validation bằng tiếng Việt; `DatMonRequest.lines` dùng `@NotNull` + `@Size(min = 1)` thay cho `@NotEmpty` + `@Size(min = 1)` (tránh báo hai lỗi trùng ý).
- Test: `XuLyLoiTest`, `XoaMonTest` (không `@Transactional`, xem chú thích trong file).

## Chạy

```bash
docker compose up -d
mvn test        # 26 test
mvn package
java -Dstdout.encoding=UTF-8 -jar target/order-api-0.0.1-SNAPSHOT.jar --spring.profiles.active=dev
curl -i "localhost:8081/orders/99999"
```
