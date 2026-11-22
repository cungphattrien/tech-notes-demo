package vn.moc.orderapi.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Positive;

// Một dòng trong yêu cầu đặt món.
public record DongDatRequest(
        @Positive long menuItemId,
        @Positive @Max(50) int quantity) {
}
