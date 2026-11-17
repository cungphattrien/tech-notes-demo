# Tập 4: Spring IoC và Dependency Injection, dựng project order-api đầu tiên

Series: Học Spring Boot: xây API đặt hàng từ con số 0. Bài viết: xem trên blog Tech Notes, mục series `hoc-spring-boot`.

Project `order-api` tạo từ start.spring.io (Spring Boot 4.1.2, Maven, Java 25, dependency Spring Web), rồi thêm ba lớp theo miền ở `../../DOMAIN.md`. Từ tập này, mỗi tập thêm một phần vào `order-api`. Thực đơn đang lưu trong bộ nhớ; tập 8 sẽ chuyển sang PostgreSQL.

## Các file

- `pom.xml`: project Spring Boot, kế thừa `spring-boot-starter-parent`.
- `MenuItem` (record), `MenuRepository` (interface), `InMemoryMenuRepository`, `MenuService`, `MenuController`: thực đơn, ba tầng nối nhau bằng constructor injection.
- `InDanhSachBean`: in ra các bean Spring đang giữ khi khởi động (chỉ để học).
- `thuchanh/KhongDungSpring.java`: tự `new` và tự nối các lớp, kèm kho dữ liệu giả, không cần Spring.

## Cần gì

JDK 17 trở lên (đã thử với Eclipse Temurin 25.0.5). Maven 3.9 đã cài, hoặc dùng `./mvnw` (Maven wrapper có sẵn trong thư mục).

## Chạy

```bash
mvn package                                              # biên dịch, chạy test, đóng gói target/order-api-0.0.1-SNAPSHOT.jar
java -Dstdout.encoding=UTF-8 -jar target/order-api-0.0.1-SNAPSHOT.jar
curl http://localhost:8080/menu
curl http://localhost:8080/menu/3
curl -i http://localhost:8080/menu/99                    # 404

# chạy không cần Spring
java -Dstdout.encoding=UTF-8 -cp target/classes vn.moc.orderapi.thuchanh.KhongDungSpring
```

Hai lỗi khởi động trong bài tự tạo lại bằng cách: xóa dòng `@Service` ở `MenuService`, hoặc thêm một lớp thứ hai `@Repository` cũng cài đặt `MenuRepository`.
