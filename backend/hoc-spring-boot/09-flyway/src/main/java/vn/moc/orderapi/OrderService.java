package vn.moc.orderapi;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class OrderService {

    // Một dòng trong yêu cầu đặt món: món nào, bao nhiêu ly.
    public record DongDat(long menuItemId, int quantity) {
    }

    private final OrderRepository orders;
    private final MenuRepository menu;

    public OrderService(OrderRepository orders, MenuRepository menu) {
        this.orders = orders;
        this.menu = menu;
    }

    public Optional<Order> find(long id) {
        return orders.findById(id);
    }

    public List<Order> findByCustomer(String customerName) {
        return orders.findByCustomerNameOrderById(customerName);
    }

    // Lấy giá hiện tại của từng món làm unitPrice, rồi lưu đơn cùng các dòng trong một transaction.
    @Transactional
    public Order datMon(String customerName, List<DongDat> dongs) {
        Order don = new Order(customerName, LocalDateTime.now());
        for (DongDat d : dongs) {
            MenuItem mon = menu.findById(d.menuItemId())
                    .orElseThrow(() -> new IllegalArgumentException("Không có món mã " + d.menuItemId()));
            don.themDong(new OrderLine(mon.getId(), d.quantity(), mon.getPrice()));
        }
        return orders.save(don);
    }
}
