# Tập 10: Kế thừa và đa hình trong Java, cà phê, bánh và đồ uống đá

Series: Học Java từ đầu cho người làm backend. Bài viết: xem trên blog Tech Notes, mục series `hoc-java-cho-backend`.

Đi từ tập 9 (`../09-class-va-object/`). `MenuItem` có thêm `donGia()` và `moTa()`, và có ba lớp con (dữ liệu quán Mộc là minh họa):

- `DoUong extends MenuItem`: ly lớn cộng 10.000 đồng.
- `DoUongDa extends DoUong`: cộng thêm 3.000 đồng tiền ly nhựa, sau khi đã tính cỡ ly.
- `Banh extends MenuItem`: không ghi đè gì.

`OrderLine` chép `item.moTa()` và `item.donGia()` lúc đặt, không cần biết món thuộc loại nào.

## Các file thử nghiệm (`thunghiem/`)

- `MonTheoLoai.java`, `ThuMonTheoLoai.java`: một class cho mọi món, phân loại bằng chuỗi; gõ nhầm loại thì mất phụ thu mà không báo lỗi.
- `ThuDaHinh.java`: cùng lời gọi `donGia()` trên biến kiểu `MenuItem`, mỗi object chạy method của class nó.
- `DoUongQuenOverride.java`: gõ nhầm tên method khi ghi đè (`dongia`), không có `@Override` nên trình biên dịch im lặng.

## Chạy

```bash
mvn test        # 19 test
mvn dependency:copy-dependencies
# Linux/macOS dùng ":" thay cho ";" trong classpath
java -Dstdout.encoding=UTF-8 -cp "target/classes;target/dependency/*" vn.moc.donhang.App
java -Dstdout.encoding=UTF-8 -cp target/classes vn.moc.donhang.thunghiem.ThuMonTheoLoai
java -Dstdout.encoding=UTF-8 -cp target/classes vn.moc.donhang.thunghiem.ThuDaHinh
java -Dstdout.encoding=UTF-8 -cp target/classes vn.moc.donhang.thunghiem.DoUongQuenOverride
```
