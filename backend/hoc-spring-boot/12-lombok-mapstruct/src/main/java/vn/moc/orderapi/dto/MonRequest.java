package vn.moc.orderapi.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

// Dữ liệu client gửi lên khi thêm hoặc sửa món. Chỉ có những trường client được phép gửi (không có id).
public record MonRequest(
        @NotBlank @Size(max = 100) String name,
        @Positive long price,
        @Size(max = 500) String description) {
}
