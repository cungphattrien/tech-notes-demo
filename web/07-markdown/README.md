# Tập 7 — Trình soạn Markdown an toàn

Cùng một bài chứa mã độc (`src/bai-doc-hai.ts`: thẻ script, liên kết `javascript:`, ảnh có `onerror`) đi qua ba cách xử lý:

```bash
npm install
npx tsx src/01-ngay-tho.ts        # marked, đưa thẳng HTML vào trang: mã độc còn nguyên
npx tsx src/02-loc-html.ts        # marked + sanitize-html (danh sách cho phép)
npx tsx src/03-khoi-an-toan.tsx   # Markdown -> khối có kiểu -> phần tử React, không có chuỗi HTML nào
npx tsx src/04-soan-bai.tsx       # ô soạn bài (textarea + xem trước) dựng một lần bằng renderToString
```

`src/soan-bai.tsx` là Client Component dùng được trong Next.js (`"use client"`). Ở đây nó chỉ được dựng phía server
bằng `renderToString` để xem kết quả, chưa chạy trong trình duyệt hay trong Next.js khi viết bài.
`markdown-an-toan.ts` là bản rút gọn của `src/lib/markdown.ts` và `src/lib/inline.ts` trong repo blog Tech Notes.
Cần Node.js 18+ (chạy bằng `tsx`).
