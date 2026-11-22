# Tập 10: Phân trang và sắp xếp với Spring Data

Series: Học Spring Boot: xây API đặt hàng từ con số 0. Bài viết: xem trên blog Tech Notes, mục series `hoc-spring-boot`.

Tiếp tục `order-api` của tập 9 (`../09-flyway/`, Spring Boot 4.1.2, Java 25). Dữ liệu quán Mộc là minh họa.

## Thay đổi so với tập 9

- `db/du-lieu-mau/V2_1__nhieu_don_mau.sql`: 1.200 đơn giả (chỉ profile `dev` và test), sinh bằng `generate_series`.
- `OrderRepository.findByCustomerName(String, Pageable)` trả `Page<Order>`; `OrderService.timDon` dùng `findAll(Pageable)` khi không có tên khách.
- `GET /orders`: tham số `khach` không bắt buộc, thêm `page`, `size`, `sort`; mặc định 20 đơn mới nhất (`@PageableDefault`).
- `application.yml`: `spring.data.web.pageable.serialization-mode: via-dto` và `max-page-size: 100`.
- Test: `OrderControllerTest` kiểm phân trang, `FlywayMigrationTest` thêm phiên bản 2.1.

## Chạy

```bash
docker compose up -d
mvn test                      # 12 test
mvn package
java -Dstdout.encoding=UTF-8 -jar target/order-api-0.0.1-SNAPSHOT.jar --spring.profiles.active=dev

curl "localhost:8081/orders?khach=Lan&size=2"
curl "localhost:8081/orders?khach=Lan&page=1&size=2&sort=createdAt,asc"
curl "localhost:8081/orders?size=100000"      # chỉ trả 100
```
