# Tập 9: Flyway, quản lý migration cho database trong Spring Boot

Series: Học Spring Boot: xây API đặt hàng từ con số 0. Bài viết: xem trên blog Tech Notes, mục series `hoc-spring-boot`.

Tiếp tục `order-api` của tập 8 (`../08-spring-data-jpa/`, Spring Boot 4.1.2, Java 25). Cấu trúc bảng giờ do Flyway 12.4.0 quản lý thay cho init script của Docker. Dữ liệu quán Mộc là minh họa.

## Thay đổi so với tập 8

- `pom.xml`: thêm `spring-boot-starter-flyway` và `flyway-database-postgresql`.
- `src/main/resources/db/migration/V1__tao_bang.sql`: ba bảng của tập 3 (trước là `db/01-schema.sql`).
- `src/main/resources/db/migration/V2__them_mo_ta_mon.sql`: thêm cột `menu_items.description`; `MenuItem` có trường `description`.
- `src/main/resources/db/du-lieu-mau/V1_1__du_lieu_mau.sql`: dữ liệu mẫu, chỉ nạp ở profile `dev` (và trong test).
- `compose.yaml`: bỏ thư mục `db/` và init script; xóa thư mục `db/`.
- Test: `TestcontainersConfiguration` không dùng init script nữa, thêm `FlywayMigrationTest`.

## Chạy

```bash
docker compose up -d
mvn test                      # 10 test
mvn package
java -Dstdout.encoding=UTF-8 -jar target/order-api-0.0.1-SNAPSHOT.jar --spring.profiles.active=dev
docker compose exec -T postgres psql -U order_api -d order_api -c 'select version, script, success from flyway_schema_history'
```

Nếu bạn còn volume PostgreSQL từ tập 8 (bảng có sẵn nhưng chưa có lịch sử Flyway), Flyway sẽ báo `Found non-empty schema(s) "public" but no schema history table`. Chạy một lần với `--spring.flyway.baseline-on-migrate=true` để coi database đang có là phiên bản 1, hoặc trên máy dev thì `docker compose down -v` để bắt đầu lại từ database trống.
