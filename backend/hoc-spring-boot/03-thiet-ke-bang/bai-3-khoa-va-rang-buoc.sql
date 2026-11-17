-- 1. Khóa chính kép: không thể ghi cùng một món hai lần trong một đơn
INSERT INTO order_lines (order_id, menu_item_id, quantity, unit_price) VALUES (1, 1, 5, 35000);

-- 2. Khóa ngoại: dòng món phải trỏ tới một đơn có thật
INSERT INTO order_lines (order_id, menu_item_id, quantity, unit_price) VALUES (99, 1, 1, 35000);

-- 3. UNIQUE: không thêm hai món trùng tên
INSERT INTO menu_items (name, price) VALUES ('Trà đào', 47000);

-- 4. Không xóa được món đang có trong đơn (khóa ngoại mặc định là chặn)
DELETE FROM menu_items WHERE name = 'Bạc xỉu';

-- 5. Xóa đơn thì xóa luôn các dòng món của đơn (ON DELETE CASCADE)
SELECT count(*) AS so_dong_mon_cua_don_1 FROM order_lines WHERE order_id = 1;
DELETE FROM orders WHERE id = 1;
SELECT count(*) AS so_dong_mon_cua_don_1 FROM order_lines WHERE order_id = 1;

-- 6. Các chỉ mục của order_lines
SELECT indexname FROM pg_indexes WHERE tablename = 'order_lines' ORDER BY indexname;
