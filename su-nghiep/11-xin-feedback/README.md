# Tập 11 — Xin feedback từ senior sao cho hiệu quả

Mọi chi tiết về Minh, công ty A, anh Phúc, chị Hạnh, pull request, ngày tháng và tin nhắn là minh họa. Tiếp tập 10: Minh đã biết cách hỏi khi bị kẹt, nhưng sau hai tuần vẫn không biết mình đang làm tốt hay chưa.

- `yeu-cau-xau.txt`: tin nhắn xin nhận xét đầu tiên của Minh (chung chung).
- `yeu-cau-tot.txt`: tin nhắn sau khi sửa (cụ thể, có giới hạn).
- `src/kiem-yeu-cau.ts` và `kiem-yeu-cau.ts`: kiểm tra một tin nhắn xin nhận xét có đủ năm phần chưa (chỉ kiểm tra sự có mặt của từng phần, không đánh giá chất lượng).
- `so-phan-hoi.txt`: sổ ghi các việc rút ra sau nhận xét, mỗi dòng một việc.
- `src/theo-doi.ts` và `theo-doi.ts`: xếp các việc theo tình trạng tại một ngày (xong chưa báo lại, quá hạn, còn hạn, đã khép vòng).
- `src/xin-feedback.test.ts`: 8 test, gồm một test ghi lại giới hạn đã biết của bộ kiểm tra.

```bash
node kiem-yeu-cau.ts yeu-cau-xau.txt
node kiem-yeu-cau.ts yeu-cau-tot.txt
node theo-doi.ts so-phan-hoi.txt 2026-12-16
node --test src/xin-feedback.test.ts
```

Cần Node.js 22.18+ (chạy thẳng file .ts, không cần cài gì).
