package vn.moc.donhang;

// Một món trong thực đơn (tên trường theo backend/DOMAIN.md). Giá tính bằng đồng.
// Là lớp cha của DoUong và Banh.
public class MenuItem {
    private final long id;
    private final String name;
    private final long price;

    public MenuItem(long id, String name, long price) {
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("Tên món không được trống");
        }
        if (price <= 0) {
            throw new IllegalArgumentException("Giá phải lớn hơn 0: " + price);
        }
        this.id = id;
        this.name = name;
        this.price = price;
    }

    public long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public long getPrice() {
        return price;
    }

    // Giá bán một phần. Lớp con ghi đè (override) nếu có cách tính riêng.
    public long donGia() {
        return price;
    }

    // Tên hiển thị trên phiếu. Lớp con ghi đè để thêm chi tiết (cỡ ly, đá...).
    public String moTa() {
        return name;
    }
}
