package vn.moc.orderapi;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import vn.moc.orderapi.loi.KhongTimThayException;

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

    // Phía "một" của quan hệ. mappedBy = "order": khóa ngoại nằm ở trường order của OrderLine.
    // cascade ALL: lưu, xóa đơn thì lưu, xóa luôn các dòng. orphanRemoval: dòng bị bỏ khỏi danh sách thì bị xóa khỏi bảng.
    // @OneToMany mặc định là LAZY: chỉ tải các dòng khi có ai đọc tới lines.
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("id")                            // các dòng luôn theo thứ tự thêm vào; thiếu nó, database trả thứ tự tùy ý
    @Getter(AccessLevel.NONE)                 // không để Lombok sinh getter trả thẳng danh sách bên trong
    private List<OrderLine> lines = new ArrayList<>();

    public Order(String customerName, LocalDateTime createdAt) {
        this.customerName = customerName;
        this.status = OrderStatus.NEW;
        this.createdAt = createdAt;
    }

    // Cách DUY NHẤT để thêm dòng: tạo dòng với tham chiếu ngược về đơn này, nên hai phía luôn khớp nhau.
    public OrderLine themMon(MenuItem mon, int quantity) {
        OrderLine dong = new OrderLine(this, mon, quantity);
        lines.add(dong);
        return dong;
    }

    public void doiSoLuong(long lineId, int quantity) {
        timDong(lineId).doiSoLuong(quantity);
    }

    // Bỏ dòng khỏi danh sách: nhờ orphanRemoval, Hibernate xóa đúng một dòng trong bảng.
    public void xoaDong(long lineId) {
        lines.remove(timDong(lineId));
    }

    private OrderLine timDong(long lineId) {
        for (OrderLine d : lines) {
            if (d.getId() != null && d.getId() == lineId) {
                return d;
            }
        }
        throw new KhongTimThayException("dòng món", lineId);
    }

    // Bản chỉ đọc: bên ngoài xem được các dòng nhưng không thêm, xóa được.
    public List<OrderLine> getLines() {
        return List.copyOf(lines);
    }

    // Tổng tiền tính từ giá lúc đặt của từng dòng; Jackson in ra thành trường "total".
    public long getTotal() {
        long tong = 0;
        for (OrderLine d : lines) {
            tong += d.thanhTien();
        }
        return tong;
    }
}
