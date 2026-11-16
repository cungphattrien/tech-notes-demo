INSERT INTO menu_items (name, price) VALUES
    ('Cà phê sữa', 35000),
    ('Bạc xỉu', 39000),
    ('Trà đào', 45000),
    ('Bánh mì que', 15000),
    ('Cà phê đen', 29000);

INSERT INTO orders (customer_name, status, created_at) VALUES
    ('Lan',  'DONE',      '2026-11-01 08:10:00'),
    ('Hùng', 'PAID',      '2026-11-01 09:30:00'),
    ('Mai',  'NEW',       '2026-11-02 07:45:00'),
    ('Nam',  'CANCELLED', '2026-11-02 10:05:00'),
    ('Lan',  'NEW',       '2026-11-03 08:20:00'),
    ('Phúc', 'NEW',       '2026-11-03 09:00:00');

INSERT INTO order_lines (order_id, menu_item_id, quantity) VALUES
    (1, 1, 2),
    (1, 4, 1),
    (2, 2, 1),
    (3, 3, 3),
    (3, 1, 1),
    (4, 2, 2),
    (5, 1, 1),
    (5, 5, 2);
