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

// Một đơn hàng (bảng orders) cùng các dòng món của nó (bảng order_lines).
@Entity
@Table(name = "orders")
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
    private List<OrderLine> lines = new ArrayList<>();

    protected Order() {
    }

    public Order(String customerName, LocalDateTime createdAt) {
        this.customerName = customerName;
        this.status = OrderStatus.NEW;
        this.createdAt = createdAt;
    }

    public void themDong(OrderLine dong) {
        lines.add(dong);
    }

    public Long getId() {
        return id;
    }

    public String getCustomerName() {
        return customerName;
    }

    public OrderStatus getStatus() {
        return status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public List<OrderLine> getLines() {
        return lines;
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
