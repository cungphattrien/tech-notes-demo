CREATE TABLE menu_items (
    id    BIGSERIAL PRIMARY KEY,
    name  TEXT   NOT NULL,
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
    order_id     BIGINT NOT NULL REFERENCES orders (id),
    menu_item_id BIGINT NOT NULL REFERENCES menu_items (id),
    quantity     INT    NOT NULL CHECK (quantity > 0),
    PRIMARY KEY (order_id, menu_item_id)
);
