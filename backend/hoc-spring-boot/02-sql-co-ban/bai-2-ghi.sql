-- Thêm món mới; RETURNING cho ta thấy dòng vừa thêm (kèm id do database cấp)
INSERT INTO menu_items (name, price) VALUES ('Sinh tố bơ', 52000) RETURNING id, name, price;

-- Sửa giá một món: nhớ WHERE
UPDATE menu_items SET price = 37000 WHERE name = 'Cà phê sữa' RETURNING id, name, price;

-- Xóa món vừa thêm
DELETE FROM menu_items WHERE name = 'Sinh tố bơ' RETURNING id, name;

-- Database tự chặn dữ liệu sai: giá âm
INSERT INTO menu_items (name, price) VALUES ('Món lỗi', -5);

-- Database chặn xóa món đang có trong đơn hàng
DELETE FROM menu_items WHERE name = 'Cà phê sữa';

-- Lỗi kinh điển: UPDATE quên WHERE. Làm trong transaction để còn quay lại.
BEGIN;
UPDATE menu_items SET price = price + 1000;
SELECT name, price FROM menu_items ORDER BY id;
ROLLBACK;
SELECT name, price FROM menu_items ORDER BY id;
