# Tập 13 — README để người mới chạy được dự án

Tiếp tập 12. Máy chủ đơn hàng đã đọc cấu hình gọn, nhưng người mới vào nhóm vẫn mất cả buổi để chạy được. Tập này viết README cho dự án đó, rồi kiểm nó theo hai cách: cho một "người mới" giả (script) làm theo README trong thư mục trống, và kiểm README không bị cũ so với code.

**Lưu ý quan trọng:** `thu-readme.ts` chỉ kiểm máy tính có chạy theo được README hay không (mất 3,5 giây). Nó không kiểm README có dễ hiểu với một con người, và không đo "10 phút". Script viết và chạy trên Windows (dùng `taskkill` để tắt máy chủ).

- `README.md`: README mới của dự án (tập này nói về file này).
- `README-cu.md`: README bản đầu (hai dòng lệnh) để so sánh. `README-het-han.md`: README cố ý để cũ.
- `scripts/setup.ts` (+ test): `npm run setup` tạo `.env` kèm khóa ngẫu nhiên.
- `thu-readme.ts`: làm theo các lệnh `npm` trong khối bash của một README, trong thư mục trống.
- `kiem-readme.ts` (+ test): kiểm đủ mục, đường dẫn và lệnh npm còn tồn tại.
- `src/`, `data/`, `.env.example`: dự án của tập 12.

```bash
npm install
node thu-readme.ts README-cu.md      # người mới bị kẹt ở npm start
node thu-readme.ts README.md         # chạy được
node kiem-readme.ts README.md
node kiem-readme.ts README-cu.md
node kiem-readme.ts README-het-han.md
npm test                             # 23 test
```

Cần Node.js 22.18+. Tên, đơn hàng đều là minh họa.
