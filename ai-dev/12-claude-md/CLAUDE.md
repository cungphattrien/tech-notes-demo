# Sổ chi tiêu: hướng dẫn cho AI

Bot Telegram ghi khoản chi ("cà phê 35k") và trả tổng tháng bằng lệnh /tong. Dữ liệu tạm giữ trong bộ nhớ.

## Lệnh
- Chạy test: `npm test`
- Kiểm tra kiểu: `npm run kiem-kieu`
- Thử phân loại khoản chi, không cần token hay mạng: `node thu-phan-loai.ts`

## Quy ước code
- Node 22.18+ chạy thẳng file `.ts` ở chế độ strip-only. Không dùng `enum`, `namespace`, hay khai báo tham số trong hàm khởi tạo kiểu `constructor(private x: number)`. `npm run kiem-kieu` bắt lỗi này.
- Import file nội bộ phải ghi đuôi `.ts`, ví dụ `import { phanLoai } from "./phan-loai.ts"`.
- Bình luận bằng tiếng Việt. Tên hàm và biến theo kiểu của file xung quanh.
- Logic nằm trong hàm thuần ở `src/phan-loai.ts`. File `src/bot.ts` chỉ nối với Telegram.
- Nhãn do mô hình AI trả về luôn được kiểm bằng code trước khi dùng, không tin chuỗi thô.

## Hỏi trước khi làm
- Thêm thư viện mới ngoài `grammy`.
- Đổi câu chữ bot trả lời, vì người dùng đã quen.

## Không làm
- Không đọc, in hay commit file `.env`. Token và khóa chỉ lấy từ biến môi trường.
