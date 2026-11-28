package vn.moc.orderapi;

// Trạng thái đơn, lưu trong cột orders.status dưới dạng chữ ('NEW', 'PAID', ...).
public enum OrderStatus {
    NEW, PAID, DONE, CANCELLED
}
