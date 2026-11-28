# Tập 18: HashMap hoạt động thế nào trong Java

Series: Học Java từ đầu cho người làm backend. Bài viết: xem trên blog Tech Notes, mục series `hoc-java-cho-backend`.

Đi từ tập 17 (`../17-collections/`). Dữ liệu quán Mộc là minh họa.

## Thay đổi so với tập 17

- `SoDonTrongNgay.demTheoCombo()`: đếm combo món theo đơn, khóa là `Set.copyOf(...)` (bất biến, không kể thứ tự gọi).
- `thunghiem/`: `NhinVaoHashMap` (CHỈ ĐỂ HỌC: đọc mảng bucket bên trong HashMap bằng reflection), `ThuBenTrongHashMap` (hashCode, bucket, mảng lớn dần 16 -> 32 -> 64...), `DoHashCodeTe` (hashCode hằng số, có và không có Comparable), `ThuKhoaBiDoi` (khóa List bị sửa sau khi vào map), `ThuDungLuongBanDau` (`new HashMap<>(1000)` và `HashMap.newHashMap(1000)`).
- Test: `SoDonTrongNgayTest` thêm 2 test (tổng 8).

## Chạy

```bash
mvn test        # 91 test
mvn dependency:copy-dependencies
# Linux/macOS dùng ":" thay cho ";" trong classpath
# --add-opens chỉ cần cho các thử nghiệm dùng NhinVaoHashMap
java -Dstdout.encoding=UTF-8 --add-opens java.base/java.util=ALL-UNNAMED -cp "target/classes;target/dependency/*" vn.moc.donhang.thunghiem.ThuBenTrongHashMap
java -Dstdout.encoding=UTF-8 --add-opens java.base/java.util=ALL-UNNAMED -cp "target/classes;target/dependency/*" vn.moc.donhang.thunghiem.DoHashCodeTe   # khoảng 6 giây
java -Dstdout.encoding=UTF-8 -cp "target/classes;target/dependency/*" vn.moc.donhang.thunghiem.ThuKhoaBiDoi
java -Dstdout.encoding=UTF-8 --add-opens java.base/java.util=ALL-UNNAMED -cp "target/classes;target/dependency/*" vn.moc.donhang.thunghiem.ThuDungLuongBanDau
```

Thời gian của `DoHashCodeTe` phụ thuộc máy; điều đáng xem là khoảng cách giữa ba loại khóa.
