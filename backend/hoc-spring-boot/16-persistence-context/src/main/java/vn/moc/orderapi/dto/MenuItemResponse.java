package vn.moc.orderapi.dto;

// Hình dạng JSON của một món mà API trả ra. Chuyển từ entity bằng DtoMapper (MapStruct).
public record MenuItemResponse(long id, String name, long price, String description) {
}
