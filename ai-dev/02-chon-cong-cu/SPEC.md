# Sổ chi tiêu — spec v1.1

> Thay đổi so với v1: thêm cách viết "nghìn / ngàn / triệu" (lỗi "35 nghìn" ở tập 1), thêm dòng `35k`,
> và viết rõ quy tắc cho lệnh `/tong`.

## Vấn đề
Mình muốn ghi lại chi tiêu hằng ngày mà không phải mở app, gõ form. Cách nhanh nhất: nhắn một dòng như nhắn tin cho bạn bè.

## Người dùng
Một người (mình). Chưa cần đăng nhập, chưa cần nhiều người dùng.

## Tính năng v1
1. Nhắn `cà phê 35k` → lưu một khoản chi: ghi chú "cà phê", số tiền 35.000đ, thời điểm nhắn.
2. Nhắn `/tong` → tổng chi của tháng hiện tại.
3. Tin nhắn không hiểu → trả lời hướng dẫn cách nhắn, **không** lưu gì.

## Ngoài phạm vi v1
Nhiều người dùng, danh mục, ngân sách, biểu đồ, sửa/xóa khoản chi, đồng tiền khác VND.

## Quy tắc đọc số tiền
| Tin nhắn | Ghi chú | Số tiền (đồng) |
|---|---|---|
| `cà phê 35k` | cà phê | 35000 |
| `cơm trưa 45.000` | cơm trưa | 45000 |
| `xăng 50000` | xăng | 50000 |
| `tiền nhà 3tr` | tiền nhà | 3000000 |
| `điện thoại 1tr2` | điện thoại | 1200000 |
| `trà sữa 32K` | trà sữa | 32000 |
| `35k cà phê` | cà phê | 35000 |
| `cà phê 35 nghìn` | cà phê | 35000 |
| `bánh mì 20 ngàn` | bánh mì | 20000 |
| `học phí 2 triệu` | học phí | 2000000 |
| `cà phê 35  nghìn` (thừa dấu cách) | cà phê | 35000 |
| `cà phê` | — | không hiểu (thiếu số tiền) |
| `cà phê 0k` | — | không hiểu (số tiền phải > 0) |
| `cà phê 35k 40k` | — | không hiểu (hai số tiền) |
| `35k` | — | không hiểu (thiếu ghi chú) |
| `laptop 1 triệu 2` | — | không hiểu (chưa hỗ trợ "triệu 2"; nhắn `1tr2`) |

- Số tiền là số nguyên đồng, lớn hơn 0, tối đa 1 tỷ.
- `k` = `nghìn` = `ngàn` = 1.000; `tr` = `triệu` = 1.000.000; `tr2` = 1,2 triệu; không phân biệt hoa thường.
- "nghìn / ngàn / triệu" phải đứng ngay sau số, cách bằng khoảng trắng (gõ thừa dấu cách vẫn hiểu: `35  nghìn`).
- Dấu `.` hoặc `,` giữa các nhóm 3 chữ số là dấu phân cách hàng nghìn.
- Ghi chú là phần còn lại sau khi bỏ số tiền, xóa khoảng trắng thừa; không được rỗng.

## Lệnh /tong
- Cộng mọi khoản chi có thời điểm nằm trong **tháng hiện tại theo giờ Việt Nam** (Asia/Ho_Chi_Minh),
  kể cả khi máy chủ chạy ở múi giờ khác.
- Trả lời: `Tháng 11/2026: 3 khoản, tổng 1.280.000đ`.
- Tháng chưa có khoản nào: `Tháng 11/2026 chưa có khoản chi nào.`

| Thời điểm nhắn (giờ VN) | Thuộc tháng |
|---|---|
| 30/11/2026 23:59 | 11/2026 |
| 01/12/2026 06:30 (= 30/11 23:30 giờ UTC) | 12/2026 |

## Tiêu chí hoàn thành
- Mọi dòng trong các bảng trên có test và test qua, kể cả test cũ.
- Không có thư viện ngoài.
