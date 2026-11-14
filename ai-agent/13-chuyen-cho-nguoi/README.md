# Tập 13 — Chuyển cho người thật và ghi log

Tiếp tập 12. Chữ đã chạy ra ngay, nhưng có những tin agent không nên tự trả lời (dị ứng, hoàn tiền, khách đang bực). Tập này thêm: quy tắc quyết định bằng code khi nào chuyển cho người, phiếu chuyển kèm tóm tắt, trạng thái cuộc trò chuyện để agent im lặng sau khi đã chuyển, và nhật ký JSON Lines (che số điện thoại) để đọc lại cả cuộc trò chuyện.

**Lưu ý quan trọng:** không có mô hình thật nào được gọi. `src/mo-hinh-gia.ts` là mô hình giả dựa trên quy tắc, và độ tự tin của nó là con số mình đặt. 14 tin trong `src/ca-thu.ts` và các quy tắc do cùng một người viết, nên "không bỏ sót" ở đây không nói gì về tin nhắn mới. Tên, đơn hàng, số điện thoại đều là minh họa.

- `src/quyet-dinh.ts`: quy tắc chuyển (an toàn → tiền → cảm xúc → lặp lại → không chắc).
- `src/tong-dai.ts`: cuộc trò chuyện, phiếu, nhân viên tiếp nhận/trả lời/đóng phiếu.
- `src/nhat-ky.ts`: nhật ký JSON Lines, che số điện thoại.
- `src/ngay-tho.ts`: bản đầu, để so sánh.
- `thu-bo-sot.ts`, `thu-sau-chuyen.ts`, `thu-nhat-ky.ts`: ba script in output dùng trong bài.
- `src/chuyen.test.ts`: 16 test.

```bash
node thu-bo-sot.ts
node thu-sau-chuyen.ts
node thu-nhat-ky.ts
node --test src/chuyen.test.ts
```

Cần Node.js 22.18+ (chạy `.ts` trực tiếp). Không cần `npm install`.
