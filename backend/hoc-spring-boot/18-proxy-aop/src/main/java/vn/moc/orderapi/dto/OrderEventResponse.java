package vn.moc.orderapi.dto;

import java.time.LocalDateTime;

// Một dòng nhật ký trả ra cho client.
public record OrderEventResponse(String type, String note, LocalDateTime createdAt) {
}
