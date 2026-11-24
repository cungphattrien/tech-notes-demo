package vn.moc.orderapi.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import java.util.List;

// Yêu cầu đặt món. @Valid trên phần tử của danh sách: kiểm luôn từng dòng bên trong.
// min = 1 trong @Size lặp lại ý của @NotEmpty, để tài liệu OpenAPI ghi đúng minItems: 1.
public record DatMonRequest(
        @NotBlank @Size(max = 100) String customerName,
        @NotEmpty @Size(min = 1, max = 20) List<@Valid DongDatRequest> lines) {
}
