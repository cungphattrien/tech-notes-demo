package vn.moc.orderapi;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import vn.moc.orderapi.dto.OrderEventResponse;

// Ghi và đọc nhật ký đơn. Hai cách ghi, khác nhau ở propagation:
@Service
public class NhatKyService {

    private final OrderEventRepository events;

    public NhatKyService(OrderEventRepository events) {
        this.events = events;
    }

    // REQUIRED (mặc định): tham gia transaction đang có. Nhật ký là một phần của việc chính:
    // việc chính rollback thì dòng nhật ký cũng mất, nên không bao giờ có "HUY" cho một đơn chưa hủy.
    @Transactional
    public void ghi(long orderId, String type, String note) {
        events.save(new OrderEvent(orderId, type, note, LocalDateTime.now()));
    }

    // REQUIRES_NEW: tạm dừng transaction đang có, mở transaction RIÊNG (một kết nối database khác),
    // commit ngay khi method xong. Dòng nhật ký còn lại kể cả khi transaction bên ngoài rollback sau đó.
    // Chỉ dùng cho việc phải giữ lại dù việc chính thất bại, như ghi nhận một lần hoàn tiền lỗi.
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void ghiDocLap(long orderId, String type, String note) {
        events.save(new OrderEvent(orderId, type, note, LocalDateTime.now()));
    }

    @Transactional(readOnly = true)
    public List<OrderEventResponse> cuaDon(long orderId) {
        return events.findByOrderIdOrderById(orderId).stream()
                .map(e -> new OrderEventResponse(e.getType(), e.getNote(), e.getCreatedAt()))
                .toList();
    }
}
