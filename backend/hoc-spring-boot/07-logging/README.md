# Tập 7: Logging trong Spring Boot, SLF4J và Logback

Series: Học Spring Boot: xây API đặt hàng từ con số 0. Bài viết: xem trên blog Tech Notes, mục series `hoc-spring-boot`.

Tiếp tục `order-api` của tập 6 (`../06-dispatcher-servlet/`, Spring Boot 4.1.2, Java 25, Logback 1.5.38, SLF4J 2.0.20). Dữ liệu quán Mộc là minh họa, xem `../../DOMAIN.md`.

## Thay đổi so với tập 6

- `ThoiGianFilter`: bỏ `println`, ghi một dòng log mức INFO cho mỗi request; đặt mã request vào MDC và header `X-Request-Id`.
- `GhiRequestInterceptor`: chỉ còn `preHandle`, ghi handler ở mức DEBUG.
- `GiamGiaService`: ghi phép tính giảm giá ở mức DEBUG.
- `application.yml`: `logging.pattern.correlation` chèn mã request vào mỗi dòng log.
- `application-dev.yml`: DEBUG cho `vn.moc.orderapi`, ghi thêm ra `logs/order-api.log`.
- `application-prod.yml`: thư viện ở mức WARN, code của mình giữ INFO.
- `thuchanh/ThuLog.java`: so sánh nối chuỗi với `{}`, và hai cách ghi log một exception.
- `src/test/.../ThoiGianFilterTest.java`: kiểm dòng log và mã request bằng `OutputCaptureExtension`.

## Chạy

```bash
mvn test        # 6 test
mvn package
java -Dstdout.encoding=UTF-8 -jar target/order-api-0.0.1-SNAPSHOT.jar
curl -i localhost:8080/menu/3

# dev: thêm dòng DEBUG và file logs/order-api.log (cổng 8081)
java -Dstdout.encoding=UTF-8 -jar target/order-api-0.0.1-SNAPSHOT.jar --spring.profiles.active=dev

# log dạng JSON (chuẩn ECS)
java -Dstdout.encoding=UTF-8 -jar target/order-api-0.0.1-SNAPSHOT.jar --logging.structured.format.console=ecs

# chương trình thử ThuLog (không cần Spring)
java -Dstdout.encoding=UTF-8 -Dloader.main=vn.moc.orderapi.thuchanh.ThuLog -cp target/order-api-0.0.1-SNAPSHOT.jar org.springframework.boot.loader.launch.PropertiesLauncher
```
