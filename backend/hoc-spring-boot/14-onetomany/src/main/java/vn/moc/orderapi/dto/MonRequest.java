package vn.moc.orderapi.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

// Dữ liệu client gửi lên khi thêm hoặc sửa món. Chỉ có những trường client được phép gửi (không có id).
public record MonRequest(
        @NotBlank(message = "Tên món không được trống") @Size(max = 100, message = "Tên món tối đa 100 ký tự") String name,
        @Positive(message = "Giá phải lớn hơn 0") long price,
        @Size(max = 500, message = "Mô tả tối đa 500 ký tự") String description) {
}
