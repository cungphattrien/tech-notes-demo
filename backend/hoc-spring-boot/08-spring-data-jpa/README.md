# Tập 8: Spring Data JPA, CRUD đơn hàng với PostgreSQL

Series: Học Spring Boot: xây API đặt hàng từ con số 0. Bài viết: xem trên blog Tech Notes, mục series `hoc-spring-boot`.

Tiếp tục `order-api` của tập 7 (`../07-logging/`, Spring Boot 4.1.2, Java 25). Thực đơn và đơn hàng giờ nằm trong PostgreSQL 17 thay vì trong bộ nhớ. Bảng và dữ liệu mẫu lấy nguyên từ tập 3 (`../03-thiet-ke-bang/schema.sql`, `du-lieu-mau.sql`), dữ liệu quán Mộc là minh họa.

## Thay đổi so với tập 7

- `pom.xml`: thêm `spring-boot-starter-data-jpa` (Hibernate 7.4.13), driver `postgresql` (42.7.14), và cho test: `spring-boot-testcontainers`, `testcontainers-postgresql` (2.0.5).
- `compose.yaml` và `db/`: PostgreSQL 17 cho máy dev, tự nạp `db/01-schema.sql`, `db/02-du-lieu-mau.sql` khi volume còn trống.
- `MenuItem` từ `record` thành `@Entity`; `MenuRepository` kế thừa `JpaRepository`; bỏ `InMemoryMenuRepository` và `thuchanh/KhongDungSpring.java` (ví dụ của tập 4 dùng kho trong bộ nhớ).
- `MenuController`: thêm `POST /menu`, `PUT /menu/{id}`, `DELETE /menu/{id}`.
- `Order`, `OrderLine`, `OrderStatus`, `OrderRepository`, `OrderService`, `OrderController`: `GET /orders/{id}`, `GET /orders?khach=...`, `POST /orders`.
- `application.yml`: kết nối datasource, `ddl-auto: validate`. `application-dev.yml`: in câu SQL (`org.hibernate.SQL: DEBUG`).
- `ThoiGianFilter`: sửa lỗi của tập 7, request kết thúc bằng exception giờ được ghi `-> 500` thay vì `-> 200`.
- Test: `TestcontainersConfiguration` (PostgreSQL thật trong Docker cho mỗi lần chạy test) và `OrderControllerTest`.

## Cần gì

JDK 17 trở lên (đã thử Temurin 25.0.5), Maven 3.9+ (đã thử 3.10.1), Docker (đã thử Docker Desktop, Docker Engine 29.9.3).

## Chạy

```bash
docker compose up -d          # PostgreSQL ở cổng 5432
mvn test                      # 8 test, tự bật PostgreSQL riêng bằng Testcontainers
mvn package
java -Dstdout.encoding=UTF-8 -jar target/order-api-0.0.1-SNAPSHOT.jar --spring.profiles.active=dev

curl localhost:8081/menu/3
curl -X POST -H "Content-Type: application/json" --data-binary @mon-moi.json localhost:8081/menu
curl "localhost:8081/orders?khach=Mai"

docker compose down           # tắt; thêm -v nếu muốn xóa cả dữ liệu để nạp lại từ db/
```

Trên Windows, gửi JSON có chữ tiếng Việt bằng `--data-binary @file.json` (file lưu UTF-8) thay vì gõ thẳng trong lệnh, để curl không làm vỡ chữ.
