# Tập 18: Spring bên trong, proxy, AOP và vòng đời bean

Series: Học Spring Boot: xây API đặt hàng từ con số 0. Bài viết: xem trên blog Tech Notes, mục series `hoc-spring-boot`.

Tiếp tục `order-api` của tập 17 (`../17-transactional/`, Spring Boot 4.1.2, Spring Framework 7.0.10). Dữ liệu quán Mộc là minh họa; cổng thanh toán là giả lập.

## Thay đổi so với tập 17

- `pom.xml`: thêm `spring-boot-starter-aspectj` (Spring Boot 3 gọi là `spring-boot-starter-aop`).
- `doluong/DoThoiGian` (annotation) và `doluong/DoThoiGianAspect` (`@Around`, `@Order(HIGHEST_PRECEDENCE)`: nằm ngoài transaction, ghi WARN khi chậm hơn `moc.do-thoi-gian.nguong-ms`, mặc định 500).
- `OrderService.datMon`, `thayDongMon`, `huyDon` có `@DoThoiGian`.
- `CongThanhToanGiaLap`: thêm `moc.thanh-toan.do-tre-ms` để giả lập cổng chậm.
- Test: `ProxyTest` (bean nào là proxy CGLIB, proxy JDK hay không phải proxy), `VongDoiBeanTest` (thứ tự constructor, BeanPostProcessor, @PostConstruct, proxy, @PreDestroy; method `final` chạy trên proxy nên trường là null), `DoThoiGianAspectTest`.

Không có migration mới.

## Chạy

```bash
docker compose up -d
mvn test        # 51 test
mvn package
java -Dstdout.encoding=UTF-8 -jar target/order-api-0.0.1-SNAPSHOT.jar --spring.profiles.active=dev --moc.thanh-toan.do-tre-ms=700
curl -X POST localhost:8081/orders/2/cancel -H "Content-Type: application/json" --data-binary @huy-don.json
# log: WARN ... DoThoiGianAspect : Chậm: OrderService.huyDon mất ... ms (ngưỡng 500 ms)
```
