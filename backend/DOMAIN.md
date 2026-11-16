# Miền chung của loạt Backend Java: quán Mộc

Mọi tập trong `backend/` dùng đúng các tên dưới đây, để các chặng nối với nhau theo khái niệm dù code tách rời.
Quán Mộc, khách hàng và đơn hàng đều là dữ liệu minh họa.

## Món (`MenuItem`)

| Trường | Kiểu | Ý nghĩa |
|---|---|---|
| `id` | `long` | Mã món |
| `name` | `String` | Tên món, ví dụ "Cà phê sữa" |
| `price` | `long` | Giá bằng đồng, số nguyên (35000 là 35.000 đồng) |

## Đơn hàng (`Order`)

| Trường | Kiểu | Ý nghĩa |
|---|---|---|
| `id` | `long` | Mã đơn |
| `customerName` | `String` | Tên khách |
| `lines` | danh sách `OrderLine` | Các dòng món |
| `status` | `OrderStatus` | `NEW`, `PAID`, `DONE` hoặc `CANCELLED` |
| `createdAt` | thời điểm | Lúc đặt đơn |

`OrderLine` gồm `menuItemId` và `quantity` (số lượng, nguyên dương).

## Quy tắc

- Tiền tính bằng đồng và là số nguyên, không có phần lẻ.
- Đơn từ 100.000 đồng trở lên được giảm 10%.
- Một đơn đã `DONE` hoặc `CANCELLED` thì không đổi trạng thái nữa.

## Các dạng rút gọn

Một số tập đầu (ví dụ giới thiệu HTTP) dùng dạng rút gọn của đơn hàng để dễ nhìn:
`{ id, customer, item, quantity }`. Tập nào dùng dạng rút gọn sẽ nói rõ trong README của tập đó.
