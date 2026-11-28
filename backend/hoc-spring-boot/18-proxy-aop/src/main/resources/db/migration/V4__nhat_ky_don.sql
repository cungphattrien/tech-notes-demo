-- Nhật ký đơn hàng: mỗi việc quan trọng xảy ra với một đơn (hủy, hoàn tiền, hoàn tiền lỗi) là một dòng.
-- note giới hạn 200 ký tự: đủ cho một lý do hay một câu báo lỗi.
CREATE TABLE order_events (
    id         BIGSERIAL    PRIMARY KEY,
    order_id   BIGINT       NOT NULL REFERENCES orders (id) ON DELETE CASCADE,
    type       TEXT         NOT NULL,
    note       VARCHAR(200),
    created_at TIMESTAMP    NOT NULL
);

CREATE INDEX idx_order_events_order_id ON order_events (order_id);
