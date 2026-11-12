# Tập 8: Xử lý lỗi và ghi log

Tiếp tập 7. Máy chủ đơn hàng của quán Mộc đã từ chối đơn hỏng, nhưng khi có chuyện xảy ra lúc không ai nhìn thì nó không để lại gì đủ để tìm nguyên nhân. Tập này thêm log JSON có `requestId`, tách lỗi của người gửi (4xx, warn) khỏi lỗi của máy chủ (5xx, error), và giữ lỗi gốc khi bọc lỗi (`cause`).

- `ban-07/order-server.ts`: máy chủ của tập 7. `node thu-truoc.ts` cho thấy nó để lại gì khi GET bị lỗi.
- `src/logger.ts`: logger JSON nhỏ (`createLogger`, `child`, `describeError`).
- `src/order-server.ts`: ghi một dòng tóm tắt mỗi request, ghi lý do từ chối đơn, bắt lỗi không lường trước, trả mã lỗi cho người gọi.
- `src/orders.ts`: `listOrders` bọc lỗi kèm mã đơn.
- `thu-log.ts`: gửi ba request vào máy chủ có log và in log.

```bash
npm ci
npx vitest run src      # 7 file, 47 test
node thu-truoc.ts
node thu-log.ts
```

Cần Node.js 22.18+ (chạy thẳng file .ts). Không thêm thư viện log: logger tự viết chỉ để cho thấy ý tưởng.
