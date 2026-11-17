-- Cách làm "nhét hết vào một bảng": mỗi dòng là một món trong một đơn, lặp lại tên khách và giá.
CREATE TABLE don_hang_phang (
    ma_don   INT  NOT NULL,
    khach    TEXT NOT NULL,
    mon      TEXT NOT NULL,
    gia_mon  BIGINT NOT NULL,
    so_luong INT  NOT NULL
);

INSERT INTO don_hang_phang (ma_don, khach, mon, gia_mon, so_luong) VALUES
    (1, 'Lan',  'Cà phê sữa',  35000, 2),
    (1, 'Lan',  'Bánh mì que', 15000, 1),
    (2, 'Hùng', 'Bạc xỉu',     39000, 1),
    (3, 'Mai',  'Trà đào',     45000, 3),
    (3, 'Mai',  'Cà phê sữa',  35000, 1),
    (4, 'Nam',  'Bạc xỉu',     39000, 2),
    (5, 'Lan',  'Cà phê sữa',  35000, 1),
    (5, 'Lan',  'Cà phê đen',  29000, 2);
