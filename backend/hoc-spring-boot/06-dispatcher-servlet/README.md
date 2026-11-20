# Tập 6: Spring MVC, DispatcherServlet xử lý một request thế nào

Series: Học Spring Boot: xây API đặt hàng từ con số 0. Bài viết: xem trên blog Tech Notes, mục series `hoc-spring-boot`.

Tiếp tục `order-api` của tập 5 (`../05-auto-configuration/`, Spring Boot 4.1.2, Java 25). Dữ liệu quán Mộc là minh họa, xem `../../DOMAIN.md`.

## Thay đổi so với tập 5

- `ThoiGianFilter`: một Servlet filter, đứng trước DispatcherServlet, in lúc request vào và ra kèm thời gian.
- `GhiRequestInterceptor` và `WebConfig`: một `HandlerInterceptor` bên trong Spring MVC, đăng ký cho `/menu/**` và `/giam-gia`.
- `DuongDiController`: `GET /duong-di` trả về ngăn xếp lời gọi từ Tomcat tới controller.
- `src/test/.../MenuControllerTest.java`: test bằng MockMvc cho các mã 200, 404, 400 và 406.

Filter và interceptor in bằng `System.out.println` cho dễ thấy; cách ghi log đúng nghĩa là chủ đề của bài sau.

## Cần gì

JDK 17 trở lên (đã thử với Eclipse Temurin 25.0.5), Maven 3.9 trở lên hoặc `./mvnw` (đã thử với Maven 3.10.1).

## Chạy

```bash
mvn test                      # 5 test: 4 của MenuControllerTest, 1 contextLoads
mvn package
java -Dstdout.encoding=UTF-8 -jar target/order-api-0.0.1-SNAPSHOT.jar --logging.level.org.springframework.web=DEBUG

curl -i localhost:8080/menu/3                              # 200
curl -i localhost:8080/menu/99                             # 404, controller trả notFound
curl -i localhost:8080/menu/abc                            # 400, không đổi được "abc" thành long
curl -i localhost:8080/khong-co                            # 404, không có handler nào
curl -i -H "Accept: application/xml" localhost:8080/menu/3 # 406, không có converter cho XML
curl localhost:8080/duong-di                               # ngăn xếp lời gọi
```
