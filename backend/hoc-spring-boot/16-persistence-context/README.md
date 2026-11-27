# Tập 16: Hibernate bên trong, persistence context, dirty checking và flush

Series: Học Spring Boot: xây API đặt hàng từ con số 0. Bài viết: xem trên blog Tech Notes, mục series `hoc-spring-boot`.

Tiếp tục `order-api` của tập 15 (`../15-n-cong-1/`, Spring Boot 4.1.2, Hibernate 7.4.13). Dữ liệu quán Mộc là minh họa.

## Thay đổi so với tập 15

- `PUT /orders/{orderId}/lines`: thay toàn bộ dòng món (`OrderController.ThayDongRequest`, `OrderService.thayDongMon`, `Order.xoaHetDong`).
- `thayDongMon` gọi `orders.flush()` hai lần có chủ ý: sau khi bỏ dòng cũ (để DELETE chạy trước INSERT, tránh vấp `uq_order_lines_order_menu`), và sau khi thêm dòng mới (để dòng mới có id trước khi dựng DTO).
- Test: `PersistenceContextTest` (6 test: cache cấp 1, dirty checking, gán lại cùng giá trị, auto flush trước JPQL, transaction readOnly), `ThayDongMonTest` (2 test, có ca rollback).

Không có migration mới.

## Chạy

```bash
docker compose up -d
mvn test        # 39 test
mvn package
java -Dstdout.encoding=UTF-8 -jar target/order-api-0.0.1-SNAPSHOT.jar --spring.profiles.active=dev
```

Profile `dev` ghi mọi câu SQL vào `logs/order-api.log`. `PersistenceContextTest` in các mốc `===== ...` ra console cùng với log SQL, để thấy câu nào chạy lúc nào.
