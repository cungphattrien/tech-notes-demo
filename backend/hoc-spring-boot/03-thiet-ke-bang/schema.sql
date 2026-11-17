CREATE TABLE menu_items (
    id    BIGSERIAL PRIMARY KEY,
    name  TEXT   NOT NULL UNIQUE,
    price BIGINT NOT NULL CHECK (price > 0)
);

CREATE TABLE orders (
    id            BIGSERIAL PRIMARY KEY,
    customer_name TEXT      NOT NULL,
    status        TEXT      NOT NULL DEFAULT 'NEW'
                  CHECK (status IN ('NEW', 'PAID', 'DONE', 'CANCELLED')),
    created_at    TIMESTAMP NOT NULL
);

CREATE TABLE order_lines (
    order_id     BIGINT NOT NULL REFERENCES orders (id) ON DELETE CASCADE,
    menu_item_id BIGINT NOT NULL REFERENCES menu_items (id),
    quantity     INT    NOT NULL CHECK (quantity > 0),
    unit_price   BIGINT NOT NULL CHECK (unit_price > 0),
    PRIMARY KEY (order_id, menu_item_id)
);

CREATE INDEX idx_order_lines_menu_item_id ON order_lines (menu_item_id);
