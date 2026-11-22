# Tập 11: Interface và abstract class trong Java, chọn cái nào

Series: Học Java từ đầu cho người làm backend. Bài viết: xem trên blog Tech Notes, mục series `hoc-java-cho-backend`.

Đi từ tập 10 (`../10-ke-thua-da-hinh/`). Dữ liệu quán Mộc là minh họa.

## Thay đổi so với tập 10

- `CoTheBan.java` (interface): `ma()`, `moTa()`, `donGia()` và default method `duocGiamGia()`.
- `MenuItem` thành `abstract class implements CoTheBan`: `donGia()` là `final` (giá gốc + `phuThu()`), `phuThu()` là abstract.
- `DoUong`, `DoUongDa`, `Banh` cài `phuThu()` thay vì ghi đè `donGia()`.
- `Voucher.java`: cài `CoTheBan`, không kế thừa `MenuItem`, `duocGiamGia()` trả `false`.
- `OrderLine` nhận `CoTheBan`, lưu `ma` (thay cho `menuItemId`, vì voucher không có mã món) và cờ `duocGiamGia`.
- `Order.themMon(CoTheBan, int)`, `Order.tongDuocGiamGia()`; giảm giá chỉ tính trên các dòng được giảm.
- `thunghiem/VoucherKeThua.java`, `ThuVoucher.java`: so cách cho voucher kế thừa `MenuItem` với cách cài interface.
- Bỏ các thử nghiệm của tập 10 không còn biên dịch (`MonTheoLoai`, `ThuMonTheoLoai`, `DoUongQuenOverride`).

## Chạy

```bash
mvn test        # 21 test
mvn dependency:copy-dependencies
# Linux/macOS dùng ":" thay cho ";" trong classpath
java -Dstdout.encoding=UTF-8 -cp "target/classes;target/dependency/*" vn.moc.donhang.App
java -Dstdout.encoding=UTF-8 -cp target/classes vn.moc.donhang.thunghiem.ThuVoucher
java -Dstdout.encoding=UTF-8 -cp target/classes vn.moc.donhang.thunghiem.ThuDaHinh
```
