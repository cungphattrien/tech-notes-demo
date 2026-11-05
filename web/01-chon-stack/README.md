# Tập 1 — Làm blog cá nhân 0đ: chọn stack

`uoc-luong.ts` ước lượng gói Supabase Free (database 500 MB, storage 1 GB) chứa được bao nhiêu bài,
và vì sao **không** lưu ảnh trong database.

```bash
node uoc-luong.ts                 # số mặc định (đo từ bài thật của Tech Notes)
node uoc-luong.ts bai-cua-ban.md  # đo theo một bài Markdown của bạn
```

Các con số "ảnh gốc 4 MB", "ảnh nén 300 KB", "phụ phí x2" là giả định, sửa ở đầu file cho đúng blog của bạn.
Giới hạn gói miễn phí lấy từ trang giá của Supabase và Vercel, tháng 11/2026 — hãy kiểm tra lại khi đọc.
