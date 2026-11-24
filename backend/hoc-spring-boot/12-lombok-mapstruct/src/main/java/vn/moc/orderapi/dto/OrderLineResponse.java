package vn.moc.orderapi.dto;

// Một dòng món trong JSON trả ra: có thêm tên món và thành tiền, thứ client cần để hiển thị.
public record OrderLineResponse(long menuItemId, String name, int quantity, long unitPrice, long lineTotal) {
}
