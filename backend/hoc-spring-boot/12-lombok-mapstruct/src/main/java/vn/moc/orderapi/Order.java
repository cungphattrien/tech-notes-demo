package vn.moc.orderapi;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

// Một đơn hàng (bảng orders) cùng các dòng món của nó (bảng order_lines).
@Entity
@Table(name = "orders")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String customerName;              // cột customer_name

    @Enumerated(EnumType.STRING)              // lưu chữ "NEW", không lưu số thứ tự 0
    private OrderStatus status;

    private LocalDateTime createdAt;          // cột created_at

    @ElementCollection
    @CollectionTable(name = "order_lines", joinColumns = @JoinColumn(name = "order_id"))
    @Getter(AccessLevel.NONE)                 // không để Lombok sinh getter trả thẳng danh sách bên trong
    private List<OrderLine> lines = new ArrayList<>();

    public Order(String customerName, LocalDateTime createdAt) {
        this.customerName = customerName;
        this.status = OrderStatus.NEW;
        this.createdAt = createdAt;
    }

    public void themDong(OrderLine dong) {
        lines.add(dong);
    }

    // Bản chỉ đọc: bên ngoài xem được các dòng nhưng không thêm, xóa được.
    public List<OrderLine> getLines() {
        return List.copyOf(lines);
    }

    // Tổng tiền tính từ giá lúc đặt của từng dòng; Jackson in ra thành trường "total".
    public long getTotal() {
        long tong = 0;
        for (OrderLine d : lines) {
            tong += d.quantity() * d.unitPrice();
        }
        return tong;
    }
}
