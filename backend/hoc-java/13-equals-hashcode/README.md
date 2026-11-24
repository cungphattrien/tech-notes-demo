# Tập 13: equals, hashCode và toString trong Java

Series: Học Java từ đầu cho người làm backend. Bài viết: xem trên blog Tech Notes, mục series `hoc-java-cho-backend`.

Đi từ tập 12 (`../12-composition/`). Dữ liệu quán Mộc là minh họa.

## Thay đổi so với tập 12

- `MenuItem`: `equals` so `getClass()` (không dùng `instanceof`), id, tên, giá; `hashCode` dùng đúng các trường đó; `toString` đọc được.
- `DoUong`: `equals`/`hashCode` thêm tùy chọn, so dưới dạng `Set` để thứ tự chọn không quan trọng; `toString` in tùy chọn.
- `Voucher` thành `record`: tự có `equals`, `hashCode`, `toString`.
- `thunghiem/ThuThongKe.java`: đếm món bán chạy bằng `HashMap<MenuItem, Integer>` và tìm món trong `HashSet`.
- `src/test/.../EqualsHashCodeTest.java`: 9 test cho các quy tắc của `equals` và `hashCode`.

Các giai đoạn trung gian của bài (chưa ghi đè gì; chỉ ghi đè `equals` bằng `instanceof`) chạy trên bản sao tạm, code có trong bài viết.

## Chạy

```bash
mvn test        # 33 test
java -Dstdout.encoding=UTF-8 -cp target/classes vn.moc.donhang.thunghiem.ThuThongKe
```
