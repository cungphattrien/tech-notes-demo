package vn.moc.orderapi.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Positive;

// Một dòng trong yêu cầu đặt món.
public record DongDatRequest(
        @Positive(message = "Mã món phải lớn hơn 0") long menuItemId,
        @Positive(message = "Số lượng phải lớn hơn 0") @Max(value = 50, message = "Mỗi dòng tối đa 50 phần") int quantity) {
}
