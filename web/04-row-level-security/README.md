# Tập 4 — Row Level Security: ai cầm key cũng chỉ đọc được bài đã đăng

Migration thứ ba cấp `select` cho `anon`, bật RLS trên bảng `posts` và thêm một policy:
người đọc chỉ thấy bài `published` đã tới giờ đăng.

```bash
npm install                            # chỉ cài PGlite: Postgres thật chạy trong Node, không cần Docker
node scripts/grant-all.mjs             # cách sửa nhanh "grant all to anon": người lạ đọc nháp, sửa và xóa bài
node scripts/rls-chua-co-policy.mjs    # bật RLS mà quên policy: không lỗi, nhưng không thấy dòng nào
node scripts/thu-rls.mjs               # làm đúng: thử đọc/sửa/xóa/thêm dưới vai anon, kể cả sau khi lỡ grant all
```

`scripts/gia-lap-supabase.mjs` tạo hai vai `anon` và `authenticated` (Supabase có sẵn, PGlite thì không)
và chạy câu SQL dưới vai `anon` bằng `set role`.

Còn lại: không vai nào ghi được qua API, kể cả tác giả. Bài sau: đăng nhập và policy cho tác giả.
