package vn.moc.orderapi.dto;

import java.time.LocalDateTime;
import java.util.List;
import vn.moc.orderapi.OrderStatus;

public record OrderResponse(
        long id,
        String customerName,
        OrderStatus status,
        LocalDateTime createdAt,
        List<OrderLineResponse> lines,
        long total) {
}
