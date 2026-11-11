# Tập 6 — ISR: trang tĩnh mà vẫn cập nhật

App Next.js 16.4.4 tối thiểu (JavaScript) với một trang `/bai-viet/[slug]`. `lib/posts.js` thay cho truy vấn
Supabase: đọc `data/posts.json`, chờ 150 ms cho giống đi qua mạng, in một dòng `[db]` mỗi lần bị gọi.

`phien-ban/` có ba bản của trang. Chép một bản vào `app/bai-viet/[slug]/page.js` rồi build:

1. chỉ có `generateStaticParams`: trang dựng lúc build, không bao giờ đổi
2. `export const dynamic = "force-dynamic"`: dựng lại ở mỗi request (gọi database mỗi lượt xem)
3. `export const revalidate = 10`: ISR

```bash
npm install
bash thu-phien-ban.sh 2        # hoặc 3: 5 request, sửa dữ liệu, đợi 11 giây, xem trang đổi lúc nào
bash thu-lam-moi-ngay.sh       # /api/revalidate: trang đổi ngay sau khi sửa (đang để phiên bản 3)
bash do-toc-do.sh 2            # hoặc 3: đo 10 request liên tiếp
```

Các script chạy trên Git Bash (Windows) hoặc macOS/Linux, cổng 3100. Cần Node.js 22.18+.
Máy chủ là `next start` chạy trên máy, không phải Vercel, nên số đo chỉ so sánh các phiên bản với nhau.
