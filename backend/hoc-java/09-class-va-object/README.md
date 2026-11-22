# Tập 9: Class và object trong Java, mô hình hóa đơn hàng và encapsulation

Series: Học Java từ đầu cho người làm backend. Bài viết: xem trên blog Tech Notes, mục series `hoc-java-cho-backend`.

Đi từ tập 8 (`../08-git-branch-merge/`). Thay ba mảng rời (tên món, số lượng, đơn giá) bằng các class theo tên trong `../../DOMAIN.md`. Quán Mộc và đơn của Mai là dữ liệu minh họa.

## Các file mới

- `MenuItem.java`, `OrderLine.java`, `Order.java`: trường `private`, kiểm tra dữ liệu trong constructor, `Order.getLines()` trả bản chỉ đọc.
- `App.java`: in phiếu tính tiền bằng `Order`.
- `thunghiem/DonHangCongKhai.java`, `ThuDonHangCongKhai.java`: class có trường `public`, ba cách làm hỏng dữ liệu.
- `thunghiem/OrderLoGetter.java`, `ThuDongGoi.java`: getter trả thẳng danh sách bên trong so với bản chỉ đọc.
- `thunghiem/ThamChieu.java`: hai biến cùng trỏ một object, `==`, và `toString` mặc định.
- `src/test/.../OrderTest.java`: 4 test cho `Order`.

## Chạy

```bash
mvn test                                   # 15 test
mvn dependency:copy-dependencies
# Linux/macOS dùng ":" thay cho ";" trong classpath
java -Dstdout.encoding=UTF-8 -cp "target/classes;target/dependency/*" vn.moc.donhang.App
java -Dstdout.encoding=UTF-8 -Dstderr.encoding=UTF-8 -cp target/classes vn.moc.donhang.thunghiem.ThuDonHangCongKhai   # sập ở cuối: chủ ý
java -Dstdout.encoding=UTF-8 -cp target/classes vn.moc.donhang.thunghiem.ThuDongGoi
java -Dstdout.encoding=UTF-8 -cp target/classes vn.moc.donhang.thunghiem.ThamChieu
```
