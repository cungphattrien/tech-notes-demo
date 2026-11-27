# Tập 14: SOLID trong Java, năm nguyên tắc qua code đơn hàng

Series: Học Java từ đầu cho người làm backend. Bài viết: xem trên blog Tech Notes, mục series `hoc-java-cho-backend`.

Đi từ tập 13 (`../13-equals-hashcode/`). Dữ liệu quán Mộc là minh họa.

## Thay đổi so với tập 13

- `QuyTacGiamGia` (interface, có hợp đồng `0 <= giam <= tongDuocGiamGia`) và các cách cài: `GiamTheoNguong`, `GiamKhachQuen`, `GiamGioVang` (nhận `Clock`), `GiamCoDinh`, `GiamLonNhat` (chọn mức lớn nhất).
- `Order` nhận `QuyTacGiamGia` qua constructor; constructor cũ dùng `GiamTheoNguong.MAC_DINH`.
- `InPhieu`: tách việc in phiếu ra khỏi `App`.
- `CanPhaChe` (interface nhỏ) cho `DoUong` và `Banh`; `UocTinhThoiGian` chỉ nhận `CanPhaChe`.
- `App`: ghép các phần, dùng `Clock` cố định 15:00 để kết quả lặp lại được.
- `thunghiem/`: `TinhGiamGiaIf`, `ThuGiamGiaIf` (chuỗi if), `GiamCoDinhSai` (phá hợp đồng), `InterfaceBeo` (interface béo).
- `src/test/.../QuyTacGiamGiaTest.java`: test hợp đồng chạy với mọi cách cài, giờ vàng ở ranh giới.

## Chạy

```bash
mvn test        # 56 test
mvn dependency:copy-dependencies
# Linux/macOS dùng ":" thay cho ";" trong classpath
java -Dstdout.encoding=UTF-8 -cp "target/classes;target/dependency/*" vn.moc.donhang.App
java -Dstdout.encoding=UTF-8 -cp target/classes vn.moc.donhang.thunghiem.ThuGiamGiaIf
java -Dstdout.encoding=UTF-8 -Dstderr.encoding=UTF-8 -cp target/classes vn.moc.donhang.thunghiem.InterfaceBeo   # sập: chủ ý
```
