-- Quán muốn có mô tả ngắn cho mỗi món. Cột cho phép NULL vì các món cũ chưa có mô tả.
ALTER TABLE menu_items ADD COLUMN description TEXT;
