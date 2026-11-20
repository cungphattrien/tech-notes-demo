# Tập 8: Git branch, merge và xử lý conflict, đẩy code lên remote

Series: Học Java từ đầu cho người làm backend. Bài viết: xem trên blog Tech Notes, mục series `hoc-java-cho-backend`.

Đi từ tập 7 (`../07-git-co-ban/`). Thư mục này là project sau khi gộp hai nhánh của bài (tính tiền cho quán Mộc, dữ liệu minh họa):

- nhánh `khuyen-mai-mua-2-tang-1`: thêm `TinhDon.soLyMienPhi` (cứ 3 ly thì 1 ly miễn phí) và test `mua6LyDuocTang2`;
- nhánh `chan-tong-tien-am`: `tinhGiamGia` báo `IllegalArgumentException` khi tổng âm, kèm test `tongTienAmThiBaoLoi`.

Hai nhánh cùng thêm test vào cuối `TinhDonTest.java` nên khi merge bị conflict; bản đã gỡ giữ cả hai test (11 lần chạy test).

## Các file

- `patches/`: thay đổi của từng nhánh, để script dựng lại lịch sử.
- `chay-demo.sh`: chạy lại các bước Git trong thư mục tạm, dùng một bare repo cục bộ thay cho GitHub.

## Chạy

```bash
mvn test            # Tests run: 11
bash chay-demo.sh   # cần Git 2.28+ ; trên Windows chạy bằng Git Bash
```
