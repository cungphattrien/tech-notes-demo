// Giá trị GIẢ để thử bộ lọc. Ghép từ nhiều mảnh lúc chạy, để file này không chứa nguyên một chuỗi giống khóa thật
// (công cụ quét bí mật của GitHub sẽ báo nếu có).
export const BOT_TOKEN_GIA = `123456789${":"}AAH${"x".repeat(32)}`;
export const MAT_KHAU_DB_GIA = `Matkhau${"-"}Gia${"-"}12345`;

// Một đoạn log LỖI BOT được dựng lại để minh họa. Thư viện gọi HTTP hay in cả địa chỉ yêu cầu vào thông báo lỗi,
// mà địa chỉ của Telegram Bot API chứa token.
export const LOG_MAU = `[2026-11-13 21:04:11] ERROR sendMessage thất bại
FetchError: request to https://api.telegram.org/bot${BOT_TOKEN_GIA}/sendMessage failed, reason: connect ETIMEDOUT
    at ClientRequest.<anonymous> (node_modules/node-fetch/lib/index.js:1491:11)
Cấu hình đang chạy: BOT_TOKEN=${BOT_TOKEN_GIA} DATABASE_URL=postgres://moc_admin:${MAT_KHAU_DB_GIA}@db.example.com:5432/sochi
Người dùng: Nguyễn Văn An (0901 000 001, an.nguyen@example.com) gửi "ăn trưa 45k"
Commit đang chạy: 3f2a9c1 (2026-11-13), đơn 1041`;
