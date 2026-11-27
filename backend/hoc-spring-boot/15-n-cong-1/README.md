# Tập 15: N+1 query trong JPA, vì sao API đơn hàng chậm dần

Series: Học Spring Boot: xây API đặt hàng từ con số 0. Bài viết: xem trên blog Tech Notes, mục series `hoc-spring-boot`.

Tiếp tục `order-api` của tập 14 (`../14-onetomany/`, Spring Boot 4.1.2, Hibernate 7.4.13). Dữ liệu quán Mộc là minh họa.

## Thay đổi so với tập 14

- `OrderRepository.timDayDu(id)`: `left join fetch` dòng món và món, một câu SQL cho một đơn. `OrderService` dùng nó cho xem, sửa, xóa dòng.
- `application.yml`: `spring.jpa.properties.hibernate.default_batch_fetch_size: 20`, tải quan hệ LAZY theo lô ở trang danh sách.
- `Order.lines`: thêm `@OrderBy("id")` để thứ tự dòng món ổn định.
- Test: `SoCauSqlTest` đếm câu SQL bằng Hibernate Statistics (1 câu cho một đơn, 4 câu cho trang 20 đơn).

Không có migration mới.

## Chạy

```bash
docker compose up -d
mvn test        # 31 test
mvn package
java -Dstdout.encoding=UTF-8 -jar target/order-api-0.0.1-SNAPSHOT.jar --spring.profiles.active=dev
```

Profile `dev` ghi mọi câu SQL vào `logs/order-api.log` (logger `org.hibernate.SQL`), nên đếm được số câu SQL của từng request.
