-- Chỉ cho máy dev và test: thêm 1.200 đơn giả để thử phân trang.
-- Tên khách xoay vòng 8 người, trạng thái xoay vòng 4 loại, mỗi đơn cách nhau 17 phút từ 04/11/2026.
INSERT INTO orders (customer_name, status, created_at)
SELECT (ARRAY['Lan', 'Hùng', 'Mai', 'Nam', 'Phúc', 'Thảo', 'Bảo', 'Vy'])[1 + (g % 8)],
       (ARRAY['NEW', 'PAID', 'DONE', 'CANCELLED'])[1 + (g % 4)],
       TIMESTAMP '2026-11-04 07:00' + g * INTERVAL '17 minutes'
FROM generate_series(1, 1200) AS g;

-- Mỗi đơn mới có một dòng món; đơn có id chẵn có thêm dòng thứ hai (món khác). Đơn giá lấy theo giá hiện tại.
INSERT INTO order_lines (order_id, menu_item_id, quantity, unit_price)
SELECT o.id, m.id, 1 + (o.id % 3), m.price
FROM orders o JOIN menu_items m ON m.id = 1 + (o.id % 5)
WHERE o.id > 6;

INSERT INTO order_lines (order_id, menu_item_id, quantity, unit_price)
SELECT o.id, m.id, 1, m.price
FROM orders o JOIN menu_items m ON m.id = 1 + ((o.id + 2) % 5)
WHERE o.id > 6 AND o.id % 2 = 0;
