# Tập 11 — Đo lượt đọc mà vẫn tôn trọng quyền riêng tư

Tiếp tập 10. Blog đã có ảnh chia sẻ đẹp, nhưng chưa biết bài nào được đọc. Tập này làm hai việc: cho thấy vì sao ghi nhật ký từng lượt truy cập là cách làm đầu tiên nhưng gây rắc rối (về riêng tư lẫn độ chính xác), rồi mô phỏng cách đếm của chính blog Tech Notes: mỗi bài mỗi ngày một con số, không ghi gì về người đọc.

**Lưu ý:** toàn bộ truy cập là GIẢ, do `src/su-kien.ts` sinh ra từ một hạt giống cố định (90 người đọc, 40 robot, 20 lượt xem thử, 30 lệnh gọi thẳng). IP dùng khối `203.0.113.0/24`, khối dành riêng cho tài liệu. Câu lệnh SQL thật của blog (bảng `post_views`, hàm `record_post_view`) nằm trong bài viết, không chạy ở đây vì cần cả Supabase.

- `src/views.ts`: các hàm thuần cùng ý với `src/lib/views.ts` của blog (`isPostSlug`, `shouldCountView`, `totalsSince`, `vnToday`).
- `src/su-kien.ts`: sinh một ngày truy cập giả.
- `src/dem-luot-doc.ts`: hai nửa của việc đếm (trình duyệt chờ 5 giây và kiểm tra; máy chủ chỉ nhận bài đã đăng).
- `nhat-ky-tho.ts`: cách làm đầu tiên, ghi nhật ký từng lượt mở trang.
- `chay.ts`: đếm bằng quy tắc, in số lượt mỗi quy tắc loại.
- `src/dem-luot-doc.test.ts`: 8 test, gồm một test ghi lại giới hạn đã biết (hai tab).

```bash
node nhat-ky-tho.ts
node chay.ts
node --test src/dem-luot-doc.test.ts
```

Cần Node.js 22.18+ (chạy thẳng file .ts, không cần cài gì).
