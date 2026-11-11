# Câu chuyện dự án, 2 phút (minh họa: Minh)

Vấn đề: Em hay quên ghi chi tiêu vì mở app ghi chép mất nhiều bước. Em làm một app cho phép ghi
bằng một tin nhắn, ví dụ "cà phê 35k", và xem tổng tháng bằng lệnh /tong.

Em làm gì: Em viết bằng Next.js và TypeScript. Phần đọc số tiền là phần khó nhất, vì người dùng
viết "35k", "35.000", "1tr2" hay "35 nghìn". Em viết 21 unit test cho phần này trước khi nối giao diện.

Quyết định kỹ thuật (chọn 1 nếu bị hỏi sâu):
1. Tách hàm đọc tin nhắn ra khỏi giao diện, để test được mà không cần trình duyệt.
2. Tin nhắn có nhiều hơn một số tiền thì từ chối và hỏi lại, thay vì đoán.
3. Tính tháng theo giờ Việt Nam, vì máy chủ chạy giờ UTC.

Lỗi khó nhất: Một khoản chi lúc 6:30 sáng ngày 1/12 bị tính vào tháng 11. Trên máy em thì đúng,
lên máy chủ thì sai, vì máy chủ chạy giờ UTC, mà 6:30 sáng ở Việt Nam là 23:30 hôm trước theo UTC.
Em tái hiện bằng cách chạy test với TZ=UTC, rồi sửa để luôn tính tháng theo giờ Việt Nam.

Nếu làm lại: Em sẽ lưu dữ liệu vào database ngay từ đầu, thay vì giữ trong bộ nhớ.
