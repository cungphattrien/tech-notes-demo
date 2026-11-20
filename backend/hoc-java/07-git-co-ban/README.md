# Tập 7: Git cơ bản, init, add, commit và .gitignore cho project Java

Series: Học Java từ đầu cho người làm backend. Bài viết: xem trên blog Tech Notes, mục series `hoc-java-cho-backend`.

Project Maven của tập 6 (`../06-junit-co-ban/`, tính tiền cho quán Mộc, dữ liệu minh họa) cộng thêm file `.gitignore`. Code Java không đổi.

## Các file

- `.gitignore`: bỏ qua `target/`, file của IDE và file rác của hệ điều hành.
- `chay-demo.sh`: chạy lại các lệnh Git của bài trong một thư mục tạm (init, add, commit, diff, restore, revert).

## Cần gì

Git (đã thử với 2.56.1), JDK 25 và Maven 3.9 trở lên (đã thử với Temurin 25.0.5 và Maven 3.10.1). Trên Windows chạy script bằng Git Bash.

## Chạy

```bash
bash chay-demo.sh
```

Script tự đặt `user.name` và `user.email` cho repo tạm, nên không đổi cấu hình Git trên máy bạn. Mã commit (ví dụ `0fe94c1`) và ngày giờ sẽ khác với bài, vì chúng phụ thuộc thời điểm chạy.
