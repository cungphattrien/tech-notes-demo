package vn.moc.orderapi;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.moc.orderapi.dto.DtoMapper;
import vn.moc.orderapi.dto.OrderResponse;
import vn.moc.orderapi.loi.KhongTimThayException;
import vn.moc.orderapi.loi.MonKhongTonTaiException;

@Service
public class OrderService {

    // Một dòng trong yêu cầu đặt món: món nào, bao nhiêu ly.
    public record DongDat(long menuItemId, int quantity) {
    }

    private final OrderRepository orders;
    private final MenuRepository menu;
    private final DtoMapper dto;

    public OrderService(OrderRepository orders, MenuRepository menu, DtoMapper dto) {
        this.orders = orders;
        this.menu = menu;
        this.dto = dto;
    }

    // Đọc và chuyển sang DTO TRONG cùng một transaction: các quan hệ LAZY được tải ở đây,
    // trước khi transaction đóng. Controller chỉ nhận DTO, không đụng tới entity.
    @Transactional(readOnly = true)
    public OrderResponse xemDon(long id) {
        return dto.toResponse(timDon(id));
    }

    @Transactional(readOnly = true)
    public Page<OrderResponse> timDon(String customerName, Pageable pageable) {
        Page<Order> trang = customerName == null
                ? orders.findAll(pageable)
                : orders.findByCustomerName(customerName, pageable);
        return trang.map(dto::toResponse);
    }

    // Lấy giá hiện tại của từng món làm unitPrice, rồi lưu đơn cùng các dòng trong một transaction.
    @Transactional
    public OrderResponse datMon(String customerName, List<DongDat> dongs) {
        Order don = new Order(customerName, LocalDateTime.now());
        for (DongDat d : dongs) {
            MenuItem mon = menu.findById(d.menuItemId())
                    .orElseThrow(() -> new MonKhongTonTaiException(d.menuItemId()));
            don.themMon(mon, d.quantity());
        }
        return dto.toResponse(orders.save(don));
    }

    @Transactional
    public OrderResponse doiSoLuong(long orderId, long lineId, int quantity) {
        Order don = timDon(orderId);
        don.doiSoLuong(lineId, quantity);
        return dto.toResponse(don);
    }

    @Transactional
    public OrderResponse xoaDong(long orderId, long lineId) {
        Order don = timDon(orderId);
        don.xoaDong(lineId);
        return dto.toResponse(don);
    }

    private Order timDon(long id) {
        return orders.findById(id).orElseThrow(() -> new KhongTimThayException("đơn", id));
    }
}
