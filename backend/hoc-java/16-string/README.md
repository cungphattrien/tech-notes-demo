# Tập 16: String và StringBuilder trong Java, vì sao String bất biến

Series: Học Java từ đầu cho người làm backend. Bài viết: xem trên blog Tech Notes, mục series `hoc-java-cho-backend`.

Đi từ tập 15 (`../15-design-pattern/`). Dữ liệu quán Mộc là minh họa; số điện thoại, địa chỉ trong code là giả.

## Thay đổi so với tập 15

- `ChuanHoa`: `ten` (Unicode NFC, bỏ dấu cách thừa), `khoaSoSanh` (thêm chữ thường với `Locale.ROOT`), `soDienThoai` (bỏ dấu cách, chấm, gạch; đổi +84 thành 0; kiểm 10 chữ số).
- `Order` lưu tên khách và địa chỉ đã chuẩn hóa; `Order.Builder.soDienThoai` dùng `ChuanHoa.soDienThoai`.
- `GiamKhachQuen` so tên theo khóa chuẩn hóa: "lan", "Lan " và "Hùng" gõ dạng NFD đều được nhận ra.
- `thunghiem/`: `ThuStringBatBien` (quên gán kết quả, `==` và `equals`), `ThuUnicode` (NFC và NFD), `DoNoiChuoi` (đo `+=` và `StringBuilder`).
- Test: `ChuanHoaTest` (15 test).

## Chạy

```bash
mvn test        # 83 test
mvn dependency:copy-dependencies
# Linux/macOS dùng ":" thay cho ";" trong classpath
java -Dstdout.encoding=UTF-8 -cp "target/classes;target/dependency/*" vn.moc.donhang.thunghiem.ThuStringBatBien
java -Dstdout.encoding=UTF-8 -cp "target/classes;target/dependency/*" vn.moc.donhang.thunghiem.ThuUnicode
java -Dstdout.encoding=UTF-8 -cp "target/classes;target/dependency/*" vn.moc.donhang.thunghiem.DoNoiChuoi   # khoảng 7 giây
```

Thời gian của `DoNoiChuoi` phụ thuộc máy; điều đáng xem là cách nó tăng khi N gấp đôi.
