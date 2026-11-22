package vn.moc.orderapi;

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

@RestController
public class OrderController {

    // Dữ liệu client gửi lên khi đặt món.
    public record DonGuiLen(String customerName, List<OrderService.DongDat> lines) {
    }

    private final OrderService service;

    public OrderController(OrderService service) {
        this.service = service;
    }

    @GetMapping("/orders/{id}")
    public ResponseEntity<Order> get(@PathVariable long id) {
        return service.find(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // GET /orders?khach=Lan&page=0&size=20&sort=createdAt,desc ; mọi tham số đều không bắt buộc.
    @GetMapping("/orders")
    public Page<Order> list(@RequestParam(required = false) String khach,
                            @PageableDefault(size = 20, sort = "id", direction = Sort.Direction.DESC) Pageable pageable) {
        return service.timDon(khach, pageable);
    }

    @PostMapping("/orders")
    public ResponseEntity<Order> create(@RequestBody DonGuiLen don) {
        Order moi = service.datMon(don.customerName(), don.lines());
        return ResponseEntity.created(URI.create("/orders/" + moi.getId())).body(moi);
    }
}
