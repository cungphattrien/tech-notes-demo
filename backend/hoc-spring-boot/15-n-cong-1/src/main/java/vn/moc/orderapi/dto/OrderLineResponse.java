package vn.moc.orderapi.dto;

// Một dòng món trong JSON trả ra. id là id của dòng (để client sửa số lượng hay xóa đúng dòng).
public record OrderLineResponse(long id, long menuItemId, String name, int quantity, long unitPrice, long lineTotal) {
}
