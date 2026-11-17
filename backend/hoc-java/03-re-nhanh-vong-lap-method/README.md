# Tập 3: Rẽ nhánh, vòng lặp và method trong Java

Series: Học Java từ đầu cho người làm backend. Bài viết: xem trên blog Tech Notes, mục series `hoc-java-cho-backend`.

Dùng miền chung ở `../../DOMAIN.md`: giá tiền là `long` (đồng), quy tắc "đơn từ 100.000 đồng giảm 10%".
Ba đơn trong bài (Lan, Mai, Bảo) là dữ liệu minh họa của quán Mộc.

## Các file

- `TinhDonThuCong.java`: cách làm ngây thơ, mọi thứ nằm trong `main` và chép đi chép lại ba lần. Có một lỗi ranh giới cố tình (`>` thay vì `>=`).
- `LoiVongLap.java`: vòng `for` chạy dư một lần, ném `ArrayIndexOutOfBoundsException`. **Cố tình lỗi.**
- `TruyenGiaTri.java`: Java truyền tham số theo giá trị; vì sao sửa số thì không đổi nhưng sửa phần tử mảng thì đổi.
- `TinhDon.java`: bản đã tách thành method (`tinhTongTien`, `tinhGiamGia`, `soMonConThieu`, `choPhepDoiTrangThai`).

## Cần gì

JDK 25 (đã thử với Eclipse Temurin 25.0.5).

## Chạy

```bash
java -Dstdout.encoding=UTF-8 TinhDonThuCong.java
java -Dstdout.encoding=UTF-8 TinhDon.java
java -Dstdout.encoding=UTF-8 TruyenGiaTri.java
java -Dstdout.encoding=UTF-8 LoiVongLap.java      # báo lỗi, đây là chủ ý
```
