-- Dòng món thành một entity riêng: cần khóa chính của riêng nó.
-- Bỏ khóa chính kép (order_id, menu_item_id), thêm cột id tự tăng (các dòng đang có được đánh số luôn),
-- và giữ quy tắc cũ "mỗi món chỉ một dòng trong một đơn" bằng ràng buộc UNIQUE.
ALTER TABLE order_lines DROP CONSTRAINT order_lines_pkey;
ALTER TABLE order_lines ADD COLUMN id BIGSERIAL PRIMARY KEY;
ALTER TABLE order_lines ADD CONSTRAINT uq_order_lines_order_menu UNIQUE (order_id, menu_item_id);
