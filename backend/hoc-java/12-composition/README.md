# Tập 12: Composition over inheritance trong Java

Series: Học Java từ đầu cho người làm backend. Bài viết: xem trên blog Tech Notes, mục series `hoc-java-cho-backend`.

Đi từ tập 11 (`../11-interface-abstract-class/`). Dữ liệu quán Mộc là minh họa.

## Thay đổi so với tập 11

- `TuyChon.java` (record): một tùy chọn của đồ uống gồm tên và phụ thu; có sẵn `LY_LON`, `DA`, `NONG`, `TRAN_CHAU`, `THACH_DAO`.
- `DoUong`: bỏ trường `lyLon`, giữ một danh sách `TuyChon` (truyền bằng varargs); phụ thu là tổng phụ thu các tùy chọn; chặn "vừa nóng vừa đá".
- Bỏ `DoUongDa.java`: đồ uống đá là `new DoUong(..., TuyChon.DA)`.
- `Combo.java`: cài `CoTheBan`, gồm nhiều `CoTheBan` khác, giá combo phải rẻ hơn mua lẻ, không được giảm thêm.
- `Order`, `OrderLine` không đổi.

Bản thử kế thừa (`DoUongTranChau extends DoUong`, `DoUongDaTranChau extends DoUongDa`) chạy trên code của tập 11, có trong bài viết.

## Chạy

```bash
mvn test        # 24 test
mvn dependency:copy-dependencies
# Linux/macOS dùng ":" thay cho ";" trong classpath
java -Dstdout.encoding=UTF-8 -cp "target/classes;target/dependency/*" vn.moc.donhang.App
java -Dstdout.encoding=UTF-8 -cp target/classes vn.moc.donhang.thunghiem.ThuDaHinh
```
