# Tập 9 — Dùng AI review code mà không mất kỹ năng

Tiếp tập 8. Một hàm `tongTheoThang` của app sổ chi tiêu cần review trước khi gộp. Tập này đi qua ba bước: tự review trước, nhờ AI review, rồi kiểm từng nhận xét bằng chạy thử.

**Lưu ý:** không có mô hình nào được gọi ở đây. Danh sách nhận xét trong `src/nhan-xet.ts` là ví dụ minh họa do mình viết tay, mô phỏng một lần AI review: ba nhận xét đúng, một nhận xét sai (về hiện trạng) và một ý kiến về cách viết.

- `src/tong-thang.ts`: code cần review (có lỗi thật).
- `src/nhan-xet.ts`: các nhận xét, mỗi nhận xét kèm một phép thử chạy được.
- `kiem-nhan-xet.ts`: chạy từng phép thử ở hai múi giờ (UTC và giờ Việt Nam) rồi kết luận.
- `src/tong-thang-sua.ts`: bản đã sửa. `src/tong-thang-sua.test.ts`: 3 test.
- `so-sanh-hai-ban.ts`: tổng tháng 12 của bản cũ và bản mới, trên máy chạy hai múi giờ.

```bash
node kiem-nhan-xet.ts
node so-sanh-hai-ban.ts
TZ=UTC node --test src/tong-thang-sua.test.ts
TZ=Asia/Ho_Chi_Minh node --test src/tong-thang-sua.test.ts
```

Cần Node.js 22.18+ (chạy thẳng file .ts, không cần cài gì). Trên Windows PowerShell, đặt biến môi trường bằng `$env:TZ = "UTC"` thay cho `TZ=UTC` trước lệnh.
