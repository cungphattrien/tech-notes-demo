# Tập 14: Quan hệ entity trong JPA, @OneToMany, lazy và eager

Series: Học Spring Boot: xây API đặt hàng từ con số 0. Bài viết: xem trên blog Tech Notes, mục series `hoc-spring-boot`.

Tiếp tục `order-api` của tập 13 (`../13-xu-ly-loi/`, Spring Boot 4.1.2, Hibernate 7.4.13). Dữ liệu quán Mộc là minh họa.

## Thay đổi so với tập 13

- `V3__order_lines_co_id.sql`: `order_lines` có cột `id` làm khóa chính, giữ `UNIQUE (order_id, menu_item_id)`.
- `OrderLine` từ `@Embeddable record` thành `@Entity` với `@ManyToOne(fetch = LAZY)` tới `Order` và `MenuItem`.
- `Order.lines`: `@OneToMany(mappedBy = "order", cascade = ALL, orphanRemoval = true)`; thêm `themMon`, `doiSoLuong`, `xoaDong`.
- `OrderService`: chuyển entity sang DTO bên trong `@Transactional(readOnly = true)`; controller chỉ nhận DTO.
- `PATCH /orders/{orderId}/lines/{lineId}` và `DELETE /orders/{orderId}/lines/{lineId}`.
- `DtoMapper` lấy tên món qua `menuItem.name`; bỏ `OrderMapper`.
- `application.yml`: `spring.jpa.open-in-view: false`.
- Test: `DongMonTest`, cập nhật `DtoMapperTest`, `FlywayMigrationTest`.

## Chạy

```bash
docker compose up -d
mvn test        # 29 test
mvn package
java -Dstdout.encoding=UTF-8 -jar target/order-api-0.0.1-SNAPSHOT.jar --spring.profiles.active=dev
```

Nếu volume PostgreSQL còn từ tập trước, Flyway sẽ chạy thêm V3. Muốn bắt đầu lại từ đầu: `docker compose down -v`.
