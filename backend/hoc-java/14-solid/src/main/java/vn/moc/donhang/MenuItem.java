package vn.moc.donhang;

import java.util.Objects;

// Một món trong thực đơn (tên trường theo backend/DOMAIN.md). Giá tính bằng đồng.
// abstract: không tạo được "một món chung chung", chỉ tạo được DoUong, Banh.
public abstract class MenuItem implements CoTheBan {
    private final long id;
    private final String name;
    private final long price;

    protected MenuItem(long id, String name, long price) {
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

    @Override
    public String ma() {
        return "MON-" + id;
    }

    // final: lớp con không viết lại được công thức "giá gốc + phụ thu", chỉ quyết định phụ thu.
    @Override
    public final long donGia() {
        return price + phuThu();
    }

    // Mỗi loại món BẮT BUỘC tự nói phụ thu của mình (có thể là 0). Quên là lỗi biên dịch.
    protected abstract long phuThu();

    @Override
    public String moTa() {
        return name;
    }

    // Hai món bằng nhau khi cùng LOẠI (getClass, không phải instanceof), cùng id, tên, giá.
    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        MenuItem khac = (MenuItem) o;
        return id == khac.id && price == khac.price && name.equals(khac.name);
    }

    // Dùng đúng các trường của equals: hai món bằng nhau thì BẮT BUỘC cùng hashCode.
    @Override
    public int hashCode() {
        return Objects.hash(getClass(), id, name, price);
    }

    @Override
    public String toString() {
        return getClass().getSimpleName() + "[id=" + id + ", name=" + name + ", price=" + price + "]";
    }
}
