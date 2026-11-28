package vn.moc.orderapi.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;

// Yêu cầu đặt món. @Valid trên phần tử của danh sách: kiểm luôn từng dòng bên trong.
// @NotNull chặn thiếu trường lines; @Size(min = 1) chặn danh sách rỗng. Dùng @NotEmpty cùng @Size(min = 1)
// thì một danh sách rỗng bị báo hai lỗi trùng ý.
public record DatMonRequest(
        @NotBlank(message = "Tên khách không được trống") @Size(max = 100, message = "Tên khách tối đa 100 ký tự") String customerName,
        @NotNull(message = "Thiếu danh sách món") @Size(min = 1, max = 20, message = "Một đơn có từ 1 đến 20 dòng món") List<@Valid DongDatRequest> lines) {
}
