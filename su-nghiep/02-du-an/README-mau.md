# Sổ chi tiêu qua tin nhắn

> README mẫu cho dự án của Minh (nhân vật minh họa). Link, số liệu và ảnh là ví dụ; thay bằng của bạn.

Nhắn `cà phê 35k` là ghi xong một khoản chi. Nhắn `/tong` để xem tổng tháng này.

**Bản chạy thử:** so-chi-tieu.vercel.app · **Ảnh:** `docs/demo.gif` (nhắn 3 khoản rồi xem tổng)

## Vì sao làm
Mình hay quên đã tiêu bao nhiêu, và lười mở app ghi chép có form 5 ô. Nhắn một dòng thì không lười được.

## Làm được gì
- Đọc số tiền theo cách người Việt hay viết: `35k`, `45.000`, `1tr2`, `35 nghìn`.
- Không hiểu thì hỏi lại, không đoán: `cà phê 35k 40k` bị từ chối vì có hai số tiền.
- `/tong` cộng theo tháng giờ Việt Nam, kể cả khi máy chủ chạy giờ UTC.

## Quyết định kỹ thuật
- **Tự viết phần đọc số tiền, không dùng thư viện:** quy tắc đặc thù tiếng Việt, mỗi quy tắc là một dòng trong `SPEC.md` và một test.
- **Từ chối khi mơ hồ:** ghi sai số tiền tệ hơn bắt người dùng nhắn lại.
- **Tính tháng theo `Asia/Ho_Chi_Minh`:** lỗi thật đã gặp, khoản chi 6:30 sáng 1/12 bị tính vào tháng 11 vì máy chủ chạy giờ UTC.

## Chạy trên máy
```bash
npm install
npm test
npm run dev
```

## Tiếp theo
Lưu vào database; nhận tin nhắn qua Telegram.
