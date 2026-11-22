package vn.moc.orderapi.dto;

import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;
import vn.moc.orderapi.MenuItem;
import vn.moc.orderapi.MenuRepository;
import vn.moc.orderapi.Order;
import vn.moc.orderapi.OrderLine;

// Chuyển entity Order sang OrderResponse. Tên món lấy bằng MỘT câu SQL cho cả trang, không phải mỗi dòng một câu.
@Component
public class OrderMapper {

    private final MenuRepository menu;

    public OrderMapper(MenuRepository menu) {
        this.menu = menu;
    }

    public OrderResponse toResponse(Order don) {
        return toResponse(don, tenMon(List.of(don)));
    }

    public Page<OrderResponse> toResponses(Page<Order> trang) {
        Map<Long, String> ten = tenMon(trang.getContent());
        return trang.map(don -> toResponse(don, ten));
    }

    private OrderResponse toResponse(Order don, Map<Long, String> ten) {
        List<OrderLineResponse> dongs = don.getLines().stream()
                .map(d -> new OrderLineResponse(d.menuItemId(), ten.get(d.menuItemId()), d.quantity(),
                        d.unitPrice(), d.quantity() * d.unitPrice()))
                .toList();
        return new OrderResponse(don.getId(), don.getCustomerName(), don.getStatus(), don.getCreatedAt(),
                dongs, don.getTotal());
    }

    // Gom mã món của mọi dòng trong các đơn, rồi tra tên bằng findAllById (một câu SELECT ... WHERE id IN (...)).
    private Map<Long, String> tenMon(List<Order> dons) {
        Set<Long> ids = new HashSet<>();
        for (Order don : dons) {
            for (OrderLine d : don.getLines()) {
                ids.add(d.menuItemId());
            }
        }
        Map<Long, String> ten = new HashMap<>();
        for (MenuItem mon : menu.findAllById(ids)) {
            ten.put(mon.getId(), mon.getName());
        }
        return ten;
    }
}
