package vn.moc.orderapi;

import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import java.net.URI;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import vn.moc.orderapi.dto.DatMonRequest;
import vn.moc.orderapi.dto.DongDatRequest;
import vn.moc.orderapi.dto.OrderEventResponse;
import vn.moc.orderapi.dto.OrderResponse;

@RestController
public class OrderController {

    // Thân request khi đổi số lượng một dòng.
    public record DoiSoLuongRequest(
            @Positive(message = "Số lượng phải lớn hơn 0") @Max(value = 50, message = "Mỗi dòng tối đa 50 phần") int quantity) {
    }

    // Thân request khi hủy đơn. Cột order_events.note chỉ chứa 200 ký tự.
    public record HuyDonRequest(
            @NotBlank(message = "Cần lý do hủy") @Size(max = 200, message = "Lý do tối đa 200 ký tự") String lyDo) {
    }

    private final OrderService service;
    private final NhatKyService nhatKy;

    public OrderController(OrderService service, NhatKyService nhatKy) {
        this.service = service;
        this.nhatKy = nhatKy;
    }

    @GetMapping("/orders/{id}")
    public OrderResponse get(@PathVariable long id) {
        return service.xemDon(id);
    }

    // GET /orders?khach=Lan&page=0&size=20&sort=createdAt,desc ; mọi tham số đều không bắt buộc.
    @GetMapping("/orders")
    public Page<OrderResponse> list(@RequestParam(required = false) String khach,
                                    @PageableDefault(size = 20, sort = "id", direction = Sort.Direction.DESC) Pageable pageable) {
        return service.timDon(khach, pageable);
    }

    @ApiResponse(responseCode = "201", description = "Đã tạo đơn; header Location trỏ tới đơn mới")
    @PostMapping("/orders")
    public ResponseEntity<OrderResponse> create(@Valid @RequestBody DatMonRequest don) {
        List<OrderService.DongDat> dongs = don.lines().stream()
                .map(d -> new OrderService.DongDat(d.menuItemId(), d.quantity()))
                .toList();
        OrderResponse moi = service.datMon(don.customerName(), dongs);
        return ResponseEntity.created(URI.create("/orders/" + moi.id())).body(moi);
    }

    @PatchMapping("/orders/{orderId}/lines/{lineId}")
    public OrderResponse doiSoLuong(@PathVariable long orderId, @PathVariable long lineId,
                                    @Valid @RequestBody DoiSoLuongRequest body) {
        return service.doiSoLuong(orderId, lineId, body.quantity());
    }

    // Thân request khi thay toàn bộ dòng món của một đơn.
    public record ThayDongRequest(
            @NotNull(message = "Thiếu danh sách món") @Size(min = 1, max = 20, message = "Một đơn có từ 1 đến 20 dòng món")
            List<@Valid DongDatRequest> lines) {
    }

    @PutMapping("/orders/{orderId}/lines")
    public OrderResponse thayDongMon(@PathVariable long orderId, @Valid @RequestBody ThayDongRequest body) {
        List<OrderService.DongDat> dongs = body.lines().stream()
                .map(d -> new OrderService.DongDat(d.menuItemId(), d.quantity()))
                .toList();
        return service.thayDongMon(orderId, dongs);
    }

    @DeleteMapping("/orders/{orderId}/lines/{lineId}")
    public OrderResponse xoaDong(@PathVariable long orderId, @PathVariable long lineId) {
        return service.xoaDong(orderId, lineId);
    }

    // Hủy đơn; đơn đã trả trước thì hoàn tiền qua cổng thanh toán. Cổng lỗi: 502 và đơn giữ nguyên.
    @PostMapping("/orders/{orderId}/cancel")
    public OrderResponse huyDon(@PathVariable long orderId, @Valid @RequestBody HuyDonRequest body)
            throws ThanhToanException {
        return service.huyDon(orderId, body.lyDo());
    }

    @GetMapping("/orders/{orderId}/events")
    public List<OrderEventResponse> nhatKy(@PathVariable long orderId) {
        return nhatKy.cuaDon(orderId);
    }
}
