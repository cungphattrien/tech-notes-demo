# Tập 5 — Đăng nhập tác giả và phân quyền

Migration thứ tư cho người đăng nhập có `app_metadata.role = 'author'` được đọc mọi bài, thêm, sửa và xóa bài.
`policy-thu/` chứa hai bộ policy sai để so sánh: "cứ đăng nhập là được ghi" và "kiểm tra `user_metadata`".

```bash
npm install                  # chỉ cài PGlite: Postgres thật chạy trong Node, không cần Docker
node scripts/thu-quyen.mjs   # ba bộ policy x bốn người: ai thấy gì, ai sửa và thêm được bài
```

`scripts/gia-lap-supabase.mjs` tạo hai vai `anon`, `authenticated` và hai hàm `auth.jwt()`, `auth.uid()`
(Supabase có sẵn, PGlite thì không). Nó không kiểm tra chữ ký JWT: nội dung JWT do script tự viết.

Còn lại: trang đọc bài gọi database ở mỗi lượt xem. Bài sau: ISR.
