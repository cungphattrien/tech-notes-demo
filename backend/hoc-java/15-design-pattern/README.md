# Tập 15: Builder, Factory và Strategy, ba design pattern hay gặp trong Java

Series: Học Java từ đầu cho người làm backend. Bài viết: xem trên blog Tech Notes, mục series `hoc-java-cho-backend`.

Đi từ tập 14 (`../14-solid/`). Dữ liệu quán Mộc là minh họa; số điện thoại, địa chỉ trong code là giả.

## Thay đổi so với tập 14

- `Order.choKhach(...)` trả về `Order.Builder`: đơn giao hàng có địa chỉ, số điện thoại, ghi chú; `tao()` kiểm các trường đi cùng nhau. Hai constructor cũ vẫn giữ.
- `ThucDon` (Factory): nơi duy nhất giữ id, tên, giá của từng món; `goi(ma, tuyChon...)` trả về `DoUong` hoặc `Banh`.
- `InPhieu` nhận một `Comparator<OrderLine>` (Strategy) để chọn thứ tự in; in thêm thông tin giao hàng.
- `App`: dùng cả ba, thêm khuyến mãi sinh nhật viết bằng lambda.
- `thunghiem/`: `DonGiaoNhieuThamSo`, `ThuThamSoNham` (truyền nhầm thứ tự tham số), `ThuThucDon`.
- Test: `DesignPatternTest` (9 test); test hợp đồng trong `QuyTacGiamGiaTest` có thêm quy tắc lambda.

## Chạy

```bash
mvn test        # 68 test
mvn dependency:copy-dependencies
# Linux/macOS dùng ":" thay cho ";" trong classpath
java -Dstdout.encoding=UTF-8 -cp "target/classes;target/dependency/*" vn.moc.donhang.App
java -Dstdout.encoding=UTF-8 -cp target/classes vn.moc.donhang.thunghiem.ThuThucDon
java -Dstdout.encoding=UTF-8 -Dstderr.encoding=UTF-8 -cp target/classes vn.moc.donhang.thunghiem.ThuThamSoNham   # sập: chủ ý
```
