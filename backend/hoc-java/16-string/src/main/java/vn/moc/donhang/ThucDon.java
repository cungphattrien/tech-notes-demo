package vn.moc.donhang;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Set;

// Factory: nơi DUY NHẤT biết mỗi món có id, tên, giá nào và là class gì (DoUong hay Banh).
// Bên ngoài chỉ nói mã món và tùy chọn; đổi giá trà đào là sửa một dòng ở đây.
public class ThucDon {

    // Dữ liệu gốc của một món trong thực đơn. private: bên ngoài không cần biết cách lưu.
    private record Mon(long id, String ten, long gia, boolean laDoUong) {
    }

    private final Map<String, Mon> theoMa = new LinkedHashMap<>();

    private ThucDon() {
    }

    // Static factory method: tên nói rõ tạo ra cái gì, thay cho một constructor không tên.
    public static ThucDon cuaQuanMoc() {
        ThucDon td = new ThucDon();
        td.theoMa.put("ca-phe-sua", new Mon(1, "Cà phê sữa", 35_000, true));
        td.theoMa.put("bac-xiu", new Mon(2, "Bạc xỉu", 39_000, true));
        td.theoMa.put("tra-dao", new Mon(3, "Trà đào", 45_000, true));
        td.theoMa.put("banh-mi-que", new Mon(4, "Bánh mì que", 15_000, false));
        td.theoMa.put("ca-phe-den", new Mon(5, "Cà phê đen", 29_000, true));
        return td;
    }

    // Factory method: người gọi nhận về một MenuItem, không cần biết đó là DoUong hay Banh.
    public MenuItem goi(String ma, TuyChon... tuyChon) {
        Mon m = theoMa.get(ma);
        if (m == null) {
            throw new IllegalArgumentException("Không có món mã " + ma + ". Các mã đang bán: " + theoMa.keySet());
        }
        if (m.laDoUong()) {
            return new DoUong(m.id(), m.ten(), m.gia(), tuyChon);
        }
        if (tuyChon.length > 0) {
            throw new IllegalArgumentException(m.ten() + " không có tùy chọn");
        }
        return new Banh(m.id(), m.ten(), m.gia());
    }

    public Set<String> cacMa() {
        return Set.copyOf(theoMa.keySet());
    }
}
