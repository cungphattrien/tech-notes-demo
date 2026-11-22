package vn.moc.orderapi;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

// Một món trong thực đơn, ứng với một dòng của bảng menu_items.
// price tính bằng đồng (số nguyên), đúng như backend/DOMAIN.md.
@Entity
@Table(name = "menu_items")
public class MenuItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // id do PostgreSQL sinh (BIGSERIAL)
    private Long id;

    private String name;

    private long price;

    private String description;             // cột thêm bởi migration V2, có thể null

    protected MenuItem() {
        // Hibernate cần constructor không tham số để tạo đối tượng từ một dòng dữ liệu
    }

    public MenuItem(String name, long price, String description) {
        this.name = name;
        this.price = price;
        this.description = description;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public long getPrice() {
        return price;
    }

    public String getDescription() {
        return description;
    }

    public void doiTenVaGia(String name, long price) {
        this.name = name;
        this.price = price;
    }
}
