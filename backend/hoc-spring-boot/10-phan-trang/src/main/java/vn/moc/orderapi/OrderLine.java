package vn.moc.orderapi;

import jakarta.persistence.Embeddable;

// Một dòng món của đơn, ứng với một dòng của bảng order_lines.
// unitPrice là giá lúc đặt: đổi giá món về sau không làm đổi đơn cũ.
@Embeddable
public record OrderLine(long menuItemId, int quantity, long unitPrice) {
}
