package vn.moc.donhang;

// Một món trong thực đơn (tên trường theo backend/DOMAIN.md). Giá tính bằng đồng.
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
}
