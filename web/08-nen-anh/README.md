# Tập 8 — Nén ảnh trước khi upload

Tiếp tập 7. Ô soạn bài đã viết và xem trước được, nhưng ảnh chụp màn hình và ảnh điện thoại rất nặng, mà nơi lưu trữ miễn phí (Supabase Storage, 1 GB) có hạn. Tập này đo bốn cách nén một ảnh lớn, và dựng lại bước nén của blog Tech Notes bằng sharp trên Node.

- `src/tao-anh-thu.ts`: tạo ảnh thử 6000x4000 giống ảnh điện thoại (EXIF có tên máy và GPS). Ảnh tạo bằng code, không phải ảnh chụp thật.
- `src/anh.ts`: các hàm thuần `fitWithin`, `shouldOptimize`, `pickSmaller`, `formatBytes` (cùng logic với `src/lib/image-optimize.ts` của blog).
- `src/nen-anh.ts`: xoay đúng chiều theo EXIF, thu nhỏ tối đa 1600 px, đổi sang WebP, giữ bản gốc nếu bản nén không nhỏ hơn.
- `src/do-nen.ts`: đo kích thước và thời gian của 4 cách nén. `src/thu-xoay.ts`: cho thấy lỗi ảnh dọc nằm ngang.

```bash
npm install
node src/tao-anh-thu.ts tmp/anh-thu.jpg
node src/do-nen.ts tmp/anh-thu.jpg
node src/thu-xoay.ts
npx vitest run          # 2 file, 12 test
```

Cần Node.js 22.18+ (chạy thẳng file .ts). sharp 0.35.5, exif-reader 2.0.2. Số liệu phụ thuộc ảnh: ảnh của bạn sẽ ra số khác.
