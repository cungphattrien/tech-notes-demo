package vn.moc.orderapi;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

// Một dòng món của đơn, giờ là một ENTITY có id riêng (bảng order_lines, migration V3).
// unitPrice vẫn là giá lúc đặt: đổi giá món về sau không làm đổi đơn cũ.
@Entity
@Table(name = "order_lines")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class OrderLine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Phía "nhiều" của quan hệ: cột order_id. Đây là phía sở hữu (owning side), Hibernate ghi khóa ngoại từ đây.
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "order_id")
    @Getter(AccessLevel.NONE)                 // không cần đi ngược từ dòng về đơn ở ngoài class
    private Order order;

    // Món của dòng này: cột menu_item_id. LAZY: chỉ tải MenuItem khi có ai đọc tới nó.
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "menu_item_id")
    private MenuItem menuItem;

    private int quantity;

    private long unitPrice;

    OrderLine(Order order, MenuItem menuItem, int quantity) {
        this.order = order;
        this.menuItem = menuItem;
        this.quantity = quantity;
        this.unitPrice = menuItem.getPrice();
    }

    void doiSoLuong(int quantity) {
        this.quantity = quantity;
    }

    public long thanhTien() {
        return quantity * unitPrice;
    }
}
