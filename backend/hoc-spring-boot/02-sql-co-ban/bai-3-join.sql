-- Một đơn có nhiều dòng món: nối ba bảng để thấy "ai mua gì, bao nhiêu"
SELECT o.id AS ma_don, o.customer_name AS khach, m.name AS mon, l.quantity AS so_luong
FROM orders o
JOIN order_lines l ON l.order_id = o.id
JOIN menu_items m ON m.id = l.menu_item_id
ORDER BY o.id, m.name;

-- Đơn số 6 chưa có dòng món nào. JOIN (INNER JOIN) bỏ nó đi:
SELECT o.id, o.customer_name, l.menu_item_id
FROM orders o
JOIN order_lines l ON l.order_id = o.id
WHERE o.id = 6;

-- LEFT JOIN giữ lại mọi đơn, chỗ không có dòng món thì để trống (NULL):
SELECT o.id, o.customer_name, l.menu_item_id
FROM orders o
LEFT JOIN order_lines l ON l.order_id = o.id
WHERE o.id = 6;

-- Tổng tiền từng đơn (kể cả đơn trống tính là 0)
SELECT o.id AS ma_don, o.customer_name AS khach, COALESCE(SUM(l.quantity * m.price), 0) AS tong_tien
FROM orders o
LEFT JOIN order_lines l ON l.order_id = o.id
LEFT JOIN menu_items m ON m.id = l.menu_item_id
GROUP BY o.id, o.customer_name
ORDER BY o.id;
