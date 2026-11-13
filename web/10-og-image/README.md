# Tập 10 — Ảnh chia sẻ (OG image) tự động cho từng bài

Tiếp tập 9. Google đã hiểu blog, nhưng khi dán link vào Facebook hay Zalo thì chỉ thấy một dòng chữ trơ trọi. Tập này dựng thẻ ảnh chia sẻ 1200x630 bằng `ImageResponse` của Next.js (`next/og`) và đo những chỗ hay sai: font, tiêu đề dài, dung lượng.

Đây là bản tối giản chạy được không cần dựng cả app Next.js. Hàm `veTheChiaSe` cùng ý với `src/lib/og/render.tsx` của blog Tech Notes; trong blog thật nó được gọi từ file `opengraph-image.tsx` (chi tiết trong bài viết).

- `src/the-chia-se.tsx`: `veTheChiaSe` (ImageResponse + font Be Vietnam Pro) và `coChuTieuDe` (tiêu đề dài thì chữ nhỏ lại).
- `src/png.ts`: đọc kích thước từ phần đầu của file PNG, để kiểm tra không cần thư viện ảnh.
- `src/tieu-de.ts`: ba tiêu đề thử (19, 57 và 199 ký tự).
- `thu-ban-dau.tsx`: cách làm đầu tiên (không nhúng font, cỡ chữ cố định).
- `ve-anh.tsx`: vẽ ba tiêu đề, thêm một lần ép cỡ chữ 72 cho tiêu đề dài để thấy lỗi, in kích thước và thời gian.
- `src/the-chia-se.test.ts`: 5 test (vitest).
- `assets/fonts/`: Be Vietnam Pro (SemiBold, ExtraBold), giấy phép SIL OFL trong `OFL.txt`.

```bash
npm install
npx tsx thu-ban-dau.tsx
npx tsx ve-anh.tsx
npx vitest run
```

Ảnh được ghi vào thư mục `ra/` (không commit). Cần Node.js 22.18+, next 16.4.4. Số đo thời gian phụ thuộc máy.
