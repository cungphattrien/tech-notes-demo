package vn.moc.orderapi;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

// Một món trong thực đơn, ứng với một dòng của bảng menu_items.
// price tính bằng đồng (số nguyên), đúng như backend/DOMAIN.md.
@Entity
@Table(name = "menu_items")
@Getter                                             // sinh getId(), getName(), getPrice(), getDescription()
@NoArgsConstructor(access = AccessLevel.PROTECTED)  // constructor rỗng cho Hibernate, không mở cho bên ngoài
public class MenuItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // id do PostgreSQL sinh (BIGSERIAL)
    private Long id;

    private String name;

    private long price;

    private String description;             // cột thêm bởi migration V2, có thể null

    public MenuItem(String name, long price, String description) {
        this.name = name;
        this.price = price;
        this.description = description;
    }

    public void doiTenVaGia(String name, long price) {
        this.name = name;
        this.price = price;
    }
}
