# Tập 9 — SEO kỹ thuật cho blog Next.js

Tiếp tập 8. Ảnh đã nhẹ, nhưng Google chưa biết blog tồn tại. Tập này dựng ba thứ giúp công cụ tìm kiếm hiểu và tìm thấy các bài viết: metadata (title, description, canonical, hreflang), sơ đồ trang (sitemap) và dữ liệu có cấu trúc JSON-LD.

Đây là bản tối giản chạy được không cần Next.js, cùng ý với `src/lib/metadata.ts`, `src/lib/structured-data.ts` và `src/lib/sitemap-xml.ts` của blog Tech Notes (bản thật nằm trong Next.js, dùng `generateMetadata` và một Route Handler).

- `src/ld.ts`: `blogPostingLd`, `breadcrumbLd`, `serializeJsonLd` (thay `<` bằng `<`).
- `src/sitemap-xml.ts`: `escapeXml` và `buildSitemapXml` (kèm hreflang và lastmod).
- `src/head.ts`: `renderHead` dựng phần `<head>` từ thông tin một trang.
- `src/kiem-seo.ts`: chấm phần `<head>`: tiêu đề, mô tả, canonical, hreflang, JSON-LD, noindex.
- `thu.ts`: chấm một trang thiếu và một trang đủ; in sơ đồ trang; thử JSON-LD khi tiêu đề chứa mã độc.
- `src/seo.test.ts`: 8 test.

```bash
node thu.ts
node --test src/seo.test.ts
```

Cần Node.js 22.18+ (chạy thẳng file .ts, không cần cài gì). Địa chỉ `blog.example.com` và bài mẫu là minh họa.
