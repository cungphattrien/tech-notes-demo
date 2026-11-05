# Sổ chi tiêu — spec v1

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
| `cà phê` | — | không hiểu (thiếu số tiền) |
| `cà phê 0k` | — | không hiểu (số tiền phải > 0) |
| `cà phê 35k 40k` | — | không hiểu (hai số tiền) |

- Số tiền là số nguyên đồng, lớn hơn 0, tối đa 1 tỷ.
- `k` = nghìn, `tr` = triệu, `tr2` = 1,2 triệu; không phân biệt hoa thường.
- Dấu `.` hoặc `,` giữa các nhóm 3 chữ số là dấu phân cách hàng nghìn.
- Ghi chú là phần còn lại sau khi bỏ số tiền, xóa khoảng trắng thừa; không được rỗng.

## Tiêu chí hoàn thành
- Mọi dòng trong bảng trên có test và test qua.
- Không có thư viện ngoài cho phần đọc số tiền.
