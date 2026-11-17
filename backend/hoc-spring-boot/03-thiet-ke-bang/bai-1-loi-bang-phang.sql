-- Lỗi sửa: tăng giá cà phê sữa lên 37000, nhưng chỉ sửa dòng của đơn 5 (đơn hôm nay), quên các đơn cũ
UPDATE don_hang_phang SET gia_mon = 37000 WHERE mon = 'Cà phê sữa' AND ma_don = 5;

SELECT mon, gia_mon, count(*) AS so_dong FROM don_hang_phang WHERE mon = 'Cà phê sữa' GROUP BY mon, gia_mon ORDER BY gia_mon;

-- Lỗi thêm: muốn đưa món mới "Sinh tố bơ" vào thực đơn khi chưa ai đặt
INSERT INTO don_hang_phang (mon, gia_mon) VALUES ('Sinh tố bơ', 52000);

-- Lỗi xóa: hủy hẳn đơn 3, đơn duy nhất có Trà đào
SELECT DISTINCT mon FROM don_hang_phang ORDER BY mon;
DELETE FROM don_hang_phang WHERE ma_don = 3;
SELECT DISTINCT mon FROM don_hang_phang ORDER BY mon;
