# Tập 12: Lombok và MapStruct, bớt code lặp khi chuyển entity sang DTO

Series: Học Spring Boot: xây API đặt hàng từ con số 0. Bài viết: xem trên blog Tech Notes, mục series `hoc-spring-boot`.

Tiếp tục `order-api` của tập 11 (`../11-dto-validation/`, Spring Boot 4.1.2, Java 25). Dữ liệu quán Mộc là minh họa.

## Thay đổi so với tập 11

- `pom.xml`: Lombok 1.18.48 (do Spring Boot quản lý), MapStruct 1.6.3, và `maven-compiler-plugin` khai báo `annotationProcessorPaths` (Lombok, `lombok-mapstruct-binding` 0.2.0, `mapstruct-processor`). Từ JDK 23, thiếu phần này thì Lombok và MapStruct không chạy.
- `MenuItem`, `Order`: `@Getter`, `@NoArgsConstructor(access = PROTECTED)` thay cho getter và constructor rỗng viết tay; `Order.lines` có `@Getter(AccessLevel.NONE)` và giữ `getLines()` trả bản chỉ đọc.
- `dto/DtoMapper.java`: interface MapStruct, `unmappedTargetPolicy = ERROR`; sinh `DtoMapperImpl` trong `target/generated-sources/annotations`.
- `dto/OrderMapper.java`: chỉ còn phần tra tên món cho cả trang, việc ghép trường giao cho `DtoMapper`.
- `MenuItemResponse`: bỏ method `from`.
- `thuchanh/ThuLombokData.java`: vì sao không dùng `@Data` cho entity.
- Test: `dto/DtoMapperTest` (unit test thuần).

## Chạy

```bash
docker compose up -d
mvn test        # 18 test
mvn package
java -Dstdout.encoding=UTF-8 -jar target/order-api-0.0.1-SNAPSHOT.jar --spring.profiles.active=dev
java -Dstdout.encoding=UTF-8 -Dloader.main=vn.moc.orderapi.thuchanh.ThuLombokData -cp target/order-api-0.0.1-SNAPSHOT.jar org.springframework.boot.loader.launch.PropertiesLauncher
```
