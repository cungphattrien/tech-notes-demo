-- Tổng tiền đơn 1 và đơn 3 trước khi đổi giá: tính theo giá hiện tại của món (m.price) và theo giá lúc đặt (l.unit_price)
SELECT o.id AS ma_don, SUM(l.quantity * m.price) AS theo_gia_hien_tai, SUM(l.quantity * l.unit_price) AS theo_gia_luc_dat
FROM orders o JOIN order_lines l ON l.order_id = o.id JOIN menu_items m ON m.id = l.menu_item_id
WHERE o.id IN (1, 3) GROUP BY o.id ORDER BY o.id;

-- Ngày 4/11 quán tăng giá cà phê sữa từ 35000 lên 37000
UPDATE menu_items SET price = 37000 WHERE name = 'Cà phê sữa';

SELECT o.id AS ma_don, SUM(l.quantity * m.price) AS theo_gia_hien_tai, SUM(l.quantity * l.unit_price) AS theo_gia_luc_dat
FROM orders o JOIN order_lines l ON l.order_id = o.id JOIN menu_items m ON m.id = l.menu_item_id
WHERE o.id IN (1, 3) GROUP BY o.id ORDER BY o.id;
