-- Đọc toàn bộ bảng món
SELECT * FROM menu_items;

-- Chỉ một số cột, lọc theo điều kiện, sắp xếp giảm dần theo giá
SELECT name, price FROM menu_items WHERE price >= 35000 ORDER BY price DESC;

-- Lọc theo chữ: món có tên bắt đầu bằng "Cà phê"
SELECT name FROM menu_items WHERE name LIKE 'Cà phê%';

-- Hai món rẻ nhất
SELECT name, price FROM menu_items ORDER BY price LIMIT 2;

-- Đếm số đơn, rồi đếm theo từng trạng thái
SELECT count(*) AS so_don FROM orders;
SELECT status, count(*) AS so_don FROM orders GROUP BY status ORDER BY status;
