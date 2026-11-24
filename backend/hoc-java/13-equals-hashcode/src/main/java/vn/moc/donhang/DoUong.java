package vn.moc.donhang;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

// Đồ uống là một món (kế thừa MenuItem: quan hệ "là một"),
// và CÓ một danh sách tùy chọn (composition: quan hệ "có một"). Không còn class con cho từng tổ hợp.
public class DoUong extends MenuItem {

    private final List<TuyChon> tuyChon;

    public DoUong(long id, String name, long price, TuyChon... tuyChon) {
        super(id, name, price);
        List<TuyChon> ds = List.of(tuyChon);
        if (ds.contains(TuyChon.NONG) && ds.contains(TuyChon.DA)) {
            throw new IllegalArgumentException("Đồ uống không thể vừa nóng vừa đá");
        }
        this.tuyChon = ds;
    }

    public List<TuyChon> getTuyChon() {
        return tuyChon;   // List.of đã là danh sách chỉ đọc
    }

    // Phụ thu = cộng phụ thu của từng tùy chọn. Đồ uống không cần biết đó là ly lớn hay trân châu.
    @Override
    protected long phuThu() {
        long tong = 0;
        for (TuyChon t : tuyChon) {
            tong += t.phuThu();
        }
        return tong;
    }

    @Override
    public String moTa() {
        if (tuyChon.isEmpty()) {
            return super.moTa();
        }
        List<String> ten = new ArrayList<>();
        for (TuyChon t : tuyChon) {
            ten.add(t.ten());
        }
        return super.moTa() + " (" + String.join(", ", ten) + ")";
    }

    // Hai đồ uống bằng nhau khi phần MenuItem bằng nhau VÀ cùng tùy chọn, không kể thứ tự chọn:
    // "đá, trân châu" và "trân châu, đá" là cùng một ly. Vì vậy so dưới dạng Set, không so List.
    @Override
    public boolean equals(Object o) {
        return super.equals(o) && Set.copyOf(tuyChon).equals(Set.copyOf(((DoUong) o).tuyChon));
    }

    @Override
    public int hashCode() {
        return 31 * super.hashCode() + Set.copyOf(tuyChon).hashCode();
    }

    @Override
    public String toString() {
        return "DoUong[id=" + getId() + ", name=" + getName() + ", price=" + getPrice() + ", tuyChon=" + tuyChon + "]";
    }
}
