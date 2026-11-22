# Tập 11: DTO, validation và OpenAPI trong Spring Boot

Series: Học Spring Boot: xây API đặt hàng từ con số 0. Bài viết: xem trên blog Tech Notes, mục series `hoc-spring-boot`.

Tiếp tục `order-api` của tập 10 (`../10-phan-trang/`, Spring Boot 4.1.2, Java 25). Dữ liệu quán Mộc là minh họa.

## Thay đổi so với tập 10

- `pom.xml`: thêm `spring-boot-starter-validation` (Hibernate Validator 9.1.5) và `springdoc-openapi-starter-webmvc-ui` 3.2.1.
- Package `dto`: `MonRequest`, `DatMonRequest`, `DongDatRequest` (có ràng buộc `@NotBlank`, `@Positive`...), `MenuItemResponse`, `OrderResponse`, `OrderLineResponse`, `OrderMapper`.
- Controller nhận `@Valid @RequestBody` và trả DTO thay vì entity; dòng món có thêm `name` và `lineTotal`.
- `OrderMapper` lấy tên món cho cả trang bằng một câu `findAllById`.
- `application-dev.yml`: `spring.web.error.include-binding-errors: always` (tên mới trong Spring Boot 4).
- `application-prod.yml`: tắt `/v3/api-docs` và Swagger UI.
- Test: `ValidationTest`.

## Chạy

```bash
docker compose up -d
mvn test        # 17 test
mvn package
java -Dstdout.encoding=UTF-8 -jar target/order-api-0.0.1-SNAPSHOT.jar --spring.profiles.active=dev
# Swagger UI: http://localhost:8081/swagger-ui.html ; tài liệu JSON: http://localhost:8081/v3/api-docs
```
