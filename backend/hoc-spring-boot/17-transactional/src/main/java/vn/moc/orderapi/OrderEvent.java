package vn.moc.orderapi;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

// Một dòng nhật ký của đơn (bảng order_events, migration V4).
// Chỉ giữ orderId, không giữ quan hệ tới Order: ghi nhật ký không cần tải đơn.
@Entity
@Table(name = "order_events")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class OrderEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private long orderId;

    private String type;                      // "HUY", "HOAN_TIEN", "HOAN_TIEN_LOI"

    private String note;

    private LocalDateTime createdAt;

    public OrderEvent(long orderId, String type, String note, LocalDateTime createdAt) {
        this.orderId = orderId;
        this.type = type;
        this.note = note;
        this.createdAt = createdAt;
    }
}
