# Tập 7: Kiểm tra dữ liệu gửi lên bằng Zod

Tiếp tập 6. Website của quán Mộc sắp gửi đơn qua `POST /don-hang`. Tập này thêm endpoint đó và kiểm tra dữ liệu gửi lên bằng Zod.

- `ban-ngay-tho/`: bản POST đầu tiên, tin hoàn toàn vào dữ liệu gửi lên. `node ban-ngay-tho/thu.ts` cho thấy một đơn hỏng làm `GET /don-hang` trả 500 cho mọi người.
- `src/order-schema.ts`: schema Zod của đơn từ website, kiểu `NewOrder` suy ra từ schema.
- `src/order-server.ts`: có `POST /don-hang`: đọc nội dung (tối đa 100 KB), kiểm tra, trả 201 hoặc 400 kèm lỗi theo từng trường.
- `thu-zod.ts`: gửi năm đơn (một đúng, bốn sai) vào máy chủ và in kết quả.

```bash
npm ci
npx vitest run src        # 5 file, 40 test
node ban-ngay-tho/thu.ts
node thu-zod.ts
```

Cần Node.js 22.18+ (chạy thẳng file .ts). Zod 4.6.7.
