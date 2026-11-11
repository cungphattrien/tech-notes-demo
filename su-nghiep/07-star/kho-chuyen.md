# Kho chuyện của Minh (minh họa)

Ba chuyện thật của bạn, mỗi chuyện ghi bốn dòng STAR. Số liệu của Minh là ví dụ; thay bằng của bạn.

## 1. Bất đồng trong nhóm đồ án (kỹ năng: làm việc nhóm, giải quyết mâu thuẫn)
- Tình huống: Đồ án nhóm 4 người, tuần 6, hai bạn bất đồng về cách đặt tên và chia file, pull request bị trả lại nhiều lần.
- Nhiệm vụ: Mình phụ trách giỏ hàng, code phụ thuộc vào cả hai bạn.
- Hành động: Hỏi riêng từng bạn, đề nghị viết năm quy ước vào CONTRIBUTING, thử trên một pull request.
- Kết quả: PR bị trả lại giảm từ 6 xuống 1 trong hai tuần; gộp trong ngày thay vì chờ 4 ngày; nộp đúng hạn.

## 2. Lỗi khó nhất: khoản chi 6:30 sáng ngày 1/12 vào nhầm tháng (kỹ năng: giải quyết vấn đề, kiên trì)
- Tình huống: Ở app sổ chi tiêu, trên máy mình đúng nhưng trên máy chủ thì khoản chi 6:30 sáng 1/12 bị tính vào tháng 11.
- Nhiệm vụ: Tìm nguyên nhân và sửa trước khi bạn bè dùng thật.
- Hành động: Đoán máy chủ chạy giờ UTC, tái hiện bằng cách chạy test với TZ=UTC, rồi sửa để luôn tính tháng theo giờ Việt Nam.
- Kết quả: Lỗi tái hiện được và được khóa bằng test; sau đó 12 bạn dùng trong hai tháng không gặp lại lỗi này.

## 3. Ngại hỏi nên mất thời gian (kỹ năng: nhận ra điểm yếu và thay đổi)
- Tình huống: Làm giỏ hàng, mình kẹt ở một lỗi state và tự loay hoay hai ngày mà không hỏi ai.
- Nhiệm vụ: Cả nhóm cần giỏ hàng xong để nối với thanh toán.
- Hành động: Mình đặt cho mình quy tắc: kẹt quá 1 giờ thì viết câu hỏi (đã thử gì, lỗi gì) và gửi cho bạn trong nhóm.
- Kết quả: Lần kẹt tiếp theo, mình hỏi sau 1 giờ và xong trong buổi chiều đó thay vì hai ngày.
