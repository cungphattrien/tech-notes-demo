# Tập 17: @Transactional trong Spring, propagation, rollback và lỗi self-invocation

Series: Học Spring Boot: xây API đặt hàng từ con số 0. Bài viết: xem trên blog Tech Notes, mục series `hoc-spring-boot`.

Tiếp tục `order-api` của tập 16 (`../16-persistence-context/`, Spring Boot 4.1.2, Spring Framework 7.0.10, Hibernate 7.4.13). Dữ liệu quán Mộc là minh họa; cổng thanh toán là giả lập, không gọi dịch vụ thật nào.

## Thay đổi so với tập 16

- Migration `V4__nhat_ky_don.sql`: bảng `order_events` (nhật ký đơn, `note` tối đa 200 ký tự). Entity `OrderEvent`, `OrderEventRepository`.
- `POST /orders/{orderId}/cancel` (thân `{"lyDo": "..."}`, xem `huy-don.json`) và `GET /orders/{orderId}/events`.
- `Order.huy()`: đơn `DONE` hoặc `CANCELLED` thì báo `KhongTheHuyException` (409).
- `CongThanhToan` (interface, `hoanTien` ném checked `ThanhToanException`), `CongThanhToanGiaLap` (bật lỗi bằng `moc.thanh-toan.gia-lap-loi=true`). `ThanhToanException` trả 502.
- `NhatKyService`: `ghi` (REQUIRED) và `ghiDocLap` (REQUIRES_NEW).
- `OrderService.huyDon`: `@Transactional(rollbackFor = ThanhToanException.class)`; nhật ký hoàn tiền lỗi ghi bằng `nhatKy.ghiDocLap` ở bean khác.
- Test: `HuyDonTest` (5 test), `BayTransactionalTest` (3 test: self-invocation, UnexpectedRollbackException khi nuốt lỗi của method REQUIRED, và bản REQUIRES_NEW). `FlywayMigrationTest` thêm phiên bản 4.

## Chạy

```bash
docker compose up -d
mvn test        # 47 test
mvn package
java -Dstdout.encoding=UTF-8 -jar target/order-api-0.0.1-SNAPSHOT.jar --spring.profiles.active=dev \
  --moc.thanh-toan.gia-lap-loi=true \
  --logging.level.org.springframework.orm.jpa.JpaTransactionManager=DEBUG
curl -X POST localhost:8081/orders/2/cancel -H "Content-Type: application/json" --data-binary @huy-don.json
curl localhost:8081/orders/2
curl localhost:8081/orders/2/events
```

Bật log DEBUG của `JpaTransactionManager` để thấy transaction nào được mở, tham gia, tạm dừng (`Suspending`), commit hay rollback.
