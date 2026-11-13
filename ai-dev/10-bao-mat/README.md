# Tập 10 — Bảo mật khi dùng AI: khóa, dữ liệu và code

Tiếp tập 9. Khi nhờ AI sửa bot sổ chi tiêu, người ta hay dán cả đoạn log hay file cấu hình vào khung chat, mà trong đó có token, mật khẩu cơ sở dữ liệu và thông tin của người dùng. Tập này dựng một bộ lọc nhỏ che những thứ đó trước khi dán, một bộ quét thư mục, và nói về việc phải làm khi đã lỡ lộ.

**Lưu ý:** mọi khóa, token, mật khẩu, số điện thoại và email trong thư mục này đều là GIẢ, được ghép từ nhiều mảnh lúc chạy (xem `src/mau-log.ts`) để file không chứa nguyên chuỗi giống khóa thật. Bộ lọc chỉ nhận ra những hình dạng đã biết, nên là lưới lọc chứ không phải lá chắn.

- `src/bi-mat.ts`: `anBiMat` tìm và che 7 loại (URL có mật khẩu, token bot Telegram, khóa AWS, JWT, gán `key=value`, email, số điện thoại), bỏ qua giá trị mẫu như `your_token_here`.
- `src/mau-log.ts`: log lỗi bot dựng lại để minh họa, và các giá trị giả.
- `loc-truoc-khi-dan.ts`: che một đoạn văn bản (mặc định là log mẫu).
- `quet-thu-muc.ts`: quét thư mục tìm bí mật trong file, kiểm tra `.env` có được `.gitignore` loại trừ không. Có chế độ `--demo` tự dựng dự án mẫu trong thư mục tạm.
- `src/bi-mat.test.ts`: 7 test, gồm một test ghi lại giới hạn đã biết.

```bash
node loc-truoc-khi-dan.ts
node quet-thu-muc.ts --demo
node --test src/bi-mat.test.ts
```

Cần Node.js 22.18+ (chạy thẳng file .ts, không cần cài gì).
