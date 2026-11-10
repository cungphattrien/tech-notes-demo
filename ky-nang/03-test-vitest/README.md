# Tập 3 — Viết test đầu tiên với Vitest để khóa lỗi lại

Code giữ nguyên như tập 2 (đã sửa lỗi đơn 1044 tổng 70 đồng), thêm Vitest và `src/orders.test.ts`.

```bash
npm install
npm test                       # = vitest run src: 11 test của parsePrice, đơn 1044 và bốn đơn trong data/orders.json
npx vitest src                 # chế độ watch: sửa file là test tự chạy lại
npx vitest run test-sai        # ví dụ test viết sai cách: tự tính lại kết quả bằng chính logic cần kiểm tra
```

Thử làm hỏng lại: trong `src/orders.ts`, đổi dòng `items: raw.items.map(...)` của `normalizeOrder` thành
`items: raw.items as OrderItem[]`, chạy `npm test`: 2 test đỏ, báo `expected 70 to be 70000`.
File trong `test-sai/` vẫn xanh, vì nó so sánh code với chính nó.

Còn lại: bản sửa và test đang nằm trên máy mình. Tập sau đưa chúng vào code chung bằng branch, commit và pull request.
