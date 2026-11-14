# Tập 13 — Ước lượng thời gian và báo tiến độ

Mọi chi tiết về Minh, anh Phúc, task "thêm bộ lọc đơn theo ngày", pull request và các con số lịch sử là **minh họa** (tên miền `.example`). Tiếp tập 12: Minh nhận một task vào thứ hai, tin là xong trong hai ngày, tới ngày thứ tư vẫn chưa xong, và không biết nói gì với anh Phúc vì con số hai ngày chỉ là đoán.

- `lich-su.json`: 8 việc Minh từng làm, mỗi việc có số giờ ước lượng và số giờ thực tế (số liệu minh họa).
- `src/uoc-luong.ts`: hệ số lệch (thực tế / ước lượng), phân vị, ước lượng bằng khoảng từ các việc nhỏ, đổi giờ thành ngày lịch (bỏ cuối tuần).
- `src/tien-do.ts`: `duBao` (khi nào nên báo sớm, ngưỡng 25% do mình tự đặt) và `kiemBaoCao` (năm phần của một bản báo tiến độ, chỉ kiểm sự có mặt bằng từ khóa).
- `thu-uoc-luong.ts`, `thu-tien-do.ts`: hai script in output dùng trong bài.
- `bao-cao-xau.txt`, `bao-cao-tot.txt`: hai bản báo tiến độ để so sánh.
- `src/uoc-luong.test.ts`: 16 test, gồm một test ghi lại giới hạn của `kiemBaoCao`.

```bash
node thu-uoc-luong.ts
node thu-tien-do.ts
node --test src/uoc-luong.test.ts
```

Cần Node.js 22.18+. Không cần `npm install`. Một ngày làm việc được tính 5 giờ tập trung (giả định của mình, mỗi người một khác); chỉ có 8 việc trong lịch sử nên các phân vị rất thô.
