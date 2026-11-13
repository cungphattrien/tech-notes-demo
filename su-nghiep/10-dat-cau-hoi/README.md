# Tập 10 — Hỏi đồng nghiệp sao cho đúng

Mọi chi tiết về Minh, công ty A, anh Phúc, lỗi `ENOTFOUND db`, ngày tháng và tin nhắn là minh họa. Tiếp tập 9: Minh bị kẹt một lỗi lạ khi chạy test và mất gần một buổi chiều tự mò mà không hỏi ai.

- `cau-hoi-xau.txt`: tin nhắn đầu tiên của Minh (thiếu gần hết).
- `cau-hoi-tot.txt`: tin nhắn sau khi sửa, đủ sáu phần.
- `mau-cau-hoi.txt`: mẫu để điền.
- `src/kiem-tra-cau-hoi.ts` và `kiem-tra.ts`: kiểm tra một tin nhắn có đủ sáu phần chưa (chỉ kiểm tra sự có mặt của từng phần, không đánh giá chất lượng).
- `src/kiem-tra-cau-hoi.test.ts`: 7 test, gồm hai test ghi lại giới hạn của bộ kiểm tra.

```bash
node kiem-tra.ts cau-hoi-xau.txt
node kiem-tra.ts cau-hoi-tot.txt
node --test src/kiem-tra-cau-hoi.test.ts
```

Cần Node.js 22.18+ (chạy thẳng file .ts, không cần cài gì).
