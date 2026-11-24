package vn.moc.donhang;

import java.util.ArrayList;
import java.util.List;

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
}
