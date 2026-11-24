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

// Phần MapStruct không làm thay được: tra tên món cho cả trang bằng MỘT câu findAllById.
// Việc ghép trường giao cho DtoMapper.
@Component
public class OrderMapper {

    private final MenuRepository menu;
    private final DtoMapper dto;

    public OrderMapper(MenuRepository menu, DtoMapper dto) {
        this.menu = menu;
        this.dto = dto;
    }

    public OrderResponse toResponse(Order don) {
        return dto.toResponse(don, tenMon(List.of(don)));
    }

    public Page<OrderResponse> toResponses(Page<Order> trang) {
        Map<Long, String> ten = tenMon(trang.getContent());
        return trang.map(don -> dto.toResponse(don, ten));
    }

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
