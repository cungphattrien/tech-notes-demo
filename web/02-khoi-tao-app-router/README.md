# Tập 2 — Khởi tạo Next.js App Router: cấu trúc thư mục và trang đầu tiên

- `blog-mini/` — project Next.js 16 nhỏ nhất cho một blog: trang chủ, danh sách bài, trang từng bài (`[slug]`),
  root layout. Bài viết nằm trong `src/content/posts.ts`.
- `blog-mini/src/app/gioi-thieu/` — cố ý chỉ có một file `.md`, không có `page.tsx`, để thấy thư mục đó không thành trang.
- `xem-duong-dan.ts` — in bảng "thư mục → đường dẫn" theo quy ước App Router (nhóm `(ten)`, thư mục riêng tư `_ten`, đoạn động `[slug]`).

```bash
cd blog-mini && npm install && npm run dev   # http://localhost:3000 (Next.js 16 cần Node.js 20.9+)
node xem-duong-dan.ts blog-mini/src/app      # Node.js 22.18+ để chạy thẳng file .ts
```

`xem-duong-dan.ts` chỉ liệt kê `page`, `route` và `layout`; các file đặc biệt như `sitemap.ts`, `robots.ts`,
`opengraph-image.tsx` cũng tạo ra đường dẫn nhưng không nằm trong bảng.

Còn lại: bài viết nằm trong code, nên sửa một lỗi chính tả cũng phải commit và deploy lại. Tập 3 chuyển bài viết vào Supabase.
