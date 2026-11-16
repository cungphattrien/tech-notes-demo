# Tập 1: Cài JDK và chạy chương trình Java đầu tiên

Series: Học Java từ đầu cho người làm backend. Bài viết: xem trên blog Tech Notes, mục series `hoc-java-cho-backend`.

## Các file

- `HelloMoc.java`: chương trình đầu tiên, in lời chào và một đơn hàng của quán Mộc.
- `HelloMocNganGon.java`: cùng việc đó bằng cú pháp ngắn của Java 25.
- `KiemTraMaHoa.java`: in ra các cấu hình mã hóa chữ mà Java đang dùng, để tìm nguyên nhân khi tiếng Việt bị vỡ chữ.

## Cần gì

JDK 25 (đã thử với Eclipse Temurin 25.0.5 trên Windows 11). Kiểm tra bằng `java --version`.

## Chạy

```bash
# Cách 1: biên dịch rồi chạy
javac HelloMoc.java
java HelloMoc

# Cách 2: chạy thẳng file nguồn (Java 11 trở lên)
java HelloMoc.java

# Tiếng Việt bị vỡ chữ? ép đầu ra thành UTF-8
java -Dstdout.encoding=UTF-8 HelloMoc.java

# Cú pháp ngắn của Java 25
java HelloMocNganGon.java
```

Dùng cú pháp `java -Dstdout.encoding=UTF-8 …` khi cửa sổ lệnh của bạn không hiển thị đúng chữ có dấu.
