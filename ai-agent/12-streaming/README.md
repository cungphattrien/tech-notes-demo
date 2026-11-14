# Tập 12 — Streaming: khách thấy chữ ngay thay vì chờ cả câu

Tiếp tập 11. Hóa đơn đã nhẹ, nhưng khách vẫn nhìn khung chat trống suốt vài giây. Tập này đổi route chat của quán Mộc sang trả câu trả lời theo từng mảnh bằng Server-Sent Events, và viết phía khách đọc luồng đó.

**Lưu ý quan trọng:** không có mô hình thật nào được gọi. `lib/mo-hinh-gia.js` là mô hình giả: chờ 800 ms rồi nhả mỗi mảnh sau 25 ms (con số mình đặt để dễ đo). Khung chat `app/khung-chat.js` chưa chạy trong trình duyệt thật khi viết bài; phần đọc luồng của nó dùng đúng `DocSse` và `TextDecoder` mà các script và test trong thư mục này đã chạy.

- `app/api/chat-cho-du/route.js`: bản cũ, đợi cả câu rồi trả một cục JSON.
- `app/api/chat/route.js`: bản streaming, SSE, dừng mô hình khi khách ngắt kết nối.
- `lib/sse.js`: tạo sự kiện SSE và bộ đọc `DocSse` có bộ đệm.
- `lib/mo-hinh-gia.js`: mô hình giả.
- `app/khung-chat.js`: khung chat (Client Component) đọc luồng và nối chữ.
- `do-thoi-gian.js`: đo thời gian tới chữ đầu và tới đủ câu. `thu-ngat.js`: ngắt kết nối giữa chừng. `thu-chunk-bi-cat.js`: hai lỗi khi chunk bị cắt.
- `lib/sse.test.js`: 9 test.

```bash
npm install
npm run build && npm start      # cổng 3200
node do-thoi-gian.js            # ở terminal khác
node thu-ngat.js
node thu-chunk-bi-cat.js        # không cần máy chủ
node --test lib/sse.test.js
```

Cần Node.js 22.18+. Next.js 16.4.4. Mọi tên và câu trả lời là minh họa.
