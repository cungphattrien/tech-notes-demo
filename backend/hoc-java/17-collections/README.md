# Tập 17: Collections trong Java, List, Set, Map và cách chọn

Series: Học Java từ đầu cho người làm backend. Bài viết: xem trên blog Tech Notes, mục series `hoc-java-cho-backend`.

Đi từ tập 16 (`../16-string/`). Dữ liệu quán Mộc là minh họa.

## Thay đổi so với tập 16

- `SoDonTrongNgay`: sổ đơn trong ngày. `LinkedHashMap<Long, Order>` tra theo mã và giữ thứ tự nhận đơn, `ArrayDeque<Long>` làm hàng chờ pha chế, `khachTrongNgay()` (mỗi khách một lần, theo thứ tự tới), `soLuongTheoMon()` (đếm bằng `Map.merge`), `banChayNhat(n)`, `boDonRong()` (dùng `removeIf`).
- `thunghiem/`: `SoDonBangList` (mã đơn là vị trí trong List, sai sau khi hủy), `DoTimDon` (đo tra mã bằng List và HashMap), `ThuThuTuSet` (HashSet, LinkedHashSet, TreeSet), `ThuXoaTrongVongLap` (ConcurrentModificationException và ca bỏ sót không báo lỗi), `ThuBayCollections` (List.of, Arrays.asList, remove(int) và remove(Object)), `ThuSoDon` (một buổi sáng của quán).
- Test: `SoDonTrongNgayTest` (6 test).

## Chạy

```bash
mvn test        # 89 test
mvn dependency:copy-dependencies
# Linux/macOS dùng ":" thay cho ";" trong classpath
java -Dstdout.encoding=UTF-8 -cp "target/classes;target/dependency/*" vn.moc.donhang.thunghiem.SoDonBangList
java -Dstdout.encoding=UTF-8 -cp "target/classes;target/dependency/*" vn.moc.donhang.thunghiem.ThuSoDon
java -Dstdout.encoding=UTF-8 -cp "target/classes;target/dependency/*" vn.moc.donhang.thunghiem.DoTimDon
```

`SoDonBangList` cố ý kết thúc bằng `IndexOutOfBoundsException`. Thời gian của `DoTimDon` phụ thuộc máy; điều đáng xem là cách nó tăng khi N gấp mười.
