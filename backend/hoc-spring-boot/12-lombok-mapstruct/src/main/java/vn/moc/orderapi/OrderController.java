package vn.moc.orderapi;

import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import vn.moc.orderapi.dto.DatMonRequest;
import vn.moc.orderapi.dto.OrderMapper;
import vn.moc.orderapi.dto.OrderResponse;

@RestController
public class OrderController {

    private final OrderService service;
    private final OrderMapper mapper;

    public OrderController(OrderService service, OrderMapper mapper) {
        this.service = service;
        this.mapper = mapper;
    }

    @GetMapping("/orders/{id}")
    public ResponseEntity<OrderResponse> get(@PathVariable long id) {
        return service.find(id)
                .map(mapper::toResponse)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // GET /orders?khach=Lan&page=0&size=20&sort=createdAt,desc ; mọi tham số đều không bắt buộc.
    @GetMapping("/orders")
    public Page<OrderResponse> list(@RequestParam(required = false) String khach,
                                    @PageableDefault(size = 20, sort = "id", direction = Sort.Direction.DESC) Pageable pageable) {
        return mapper.toResponses(service.timDon(khach, pageable));
    }

    @ApiResponse(responseCode = "201", description = "Đã tạo đơn; header Location trỏ tới đơn mới")
    @PostMapping("/orders")
    public ResponseEntity<OrderResponse> create(@Valid @RequestBody DatMonRequest don) {
        List<OrderService.DongDat> dongs = don.lines().stream()
                .map(d -> new OrderService.DongDat(d.menuItemId(), d.quantity()))
                .toList();
        Order moi = service.datMon(don.customerName(), dongs);
        return ResponseEntity.created(URI.create("/orders/" + moi.getId())).body(mapper.toResponse(moi));
    }
}
