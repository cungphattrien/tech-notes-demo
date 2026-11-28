package vn.moc.donhang;

import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.Deque;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

// Sổ đơn trong ngày của quán: nhận đơn và cấp mã, tra theo mã, hàng chờ pha chế, thống kê cuối ngày.
// Mỗi việc dùng một loại collection, chọn theo cách nó được dùng (xem bài Collections).
public class SoDonTrongNgay {

    // Map: tra theo mã. LinkedHashMap thay vì HashMap để duyệt theo đúng thứ tự nhận đơn.
    private final Map<Long, Order> theoMa = new LinkedHashMap<>();
    // Deque dùng như hàng đợi: đơn nhận trước được pha trước (thêm ở cuối, lấy ở đầu).
    private final Deque<Long> choPhaChe = new ArrayDeque<>();
    private long maTiepTheo = 1;

    // Cấp mã mới (không bao giờ dùng lại mã cũ, kể cả khi đơn bị hủy), rồi đưa vào hàng chờ.
    public long nhan(Order don) {
        long ma = maTiepTheo++;
        theoMa.put(ma, don);
        choPhaChe.addLast(ma);
        return ma;
    }

    // Trả về null nếu không có đơn mã này.
    public Order tim(long ma) {
        return theoMa.get(ma);
    }

    public boolean huy(long ma) {
        choPhaChe.remove(ma);
        return theoMa.remove(ma) != null;
    }

    // Mã đơn tiếp theo cần pha; null khi hàng chờ đã hết.
    public Long phaTiep() {
        return choPhaChe.pollFirst();
    }

    public int soDonChoPha() {
        return choPhaChe.size();
    }

    public int soDon() {
        return theoMa.size();
    }

    // Mọi đơn của một khách, theo thứ tự đặt. "lan" và "Lan" là cùng một khách (ChuanHoa.khoaSoSanh).
    public List<Order> donCua(String tenKhach) {
        String khoa = ChuanHoa.khoaSoSanh(tenKhach);
        List<Order> ketQua = new ArrayList<>();
        for (Order don : theoMa.values()) {
            if (ChuanHoa.khoaSoSanh(don.getCustomerName()).equals(khoa)) {
                ketQua.add(don);
            }
        }
        return ketQua;
    }

    // Khách đã tới trong ngày, mỗi người một lần, theo thứ tự tới lần đầu.
    // Khóa của Map là khóa so sánh, giá trị là tên như khách gõ ở đơn đầu tiên.
    public Set<String> khachTrongNgay() {
        Map<String, String> theoKhoa = new LinkedHashMap<>();
        for (Order don : theoMa.values()) {
            theoKhoa.putIfAbsent(ChuanHoa.khoaSoSanh(don.getCustomerName()), don.getCustomerName());
        }
        return new LinkedHashSet<>(theoKhoa.values());
    }

    // Tổng số lượng bán của từng món (theo mô tả trên phiếu), theo thứ tự món xuất hiện lần đầu.
    public Map<String, Integer> soLuongTheoMon() {
        Map<String, Integer> dem = new LinkedHashMap<>();
        for (Order don : theoMa.values()) {
            for (OrderLine dong : don.getLines()) {
                dem.merge(dong.getItemName(), dong.getQuantity(), Integer::sum);
            }
        }
        return dem;
    }

    // Mỗi combo (tập các món trong một đơn, không kể thứ tự gọi) xuất hiện trong bao nhiêu đơn.
    // Khóa là Set.copyOf(...): bất biến, nên không ai sửa được khóa sau khi nó đã vào map (xem bài HashMap).
    // Set chứ không phải List: "trà đào, bánh" và "bánh, trà đào" là cùng một combo.
    public Map<Set<String>, Integer> demTheoCombo() {
        Map<Set<String>, Integer> dem = new HashMap<>();
        for (Order don : theoMa.values()) {
            Set<String> mon = new HashSet<>();
            for (OrderLine dong : don.getLines()) {
                mon.add(dong.getItemName());
            }
            if (!mon.isEmpty()) {
                dem.merge(Set.copyOf(mon), 1, Integer::sum);
            }
        }
        return dem;
    }

    // n món bán nhiều nhất. Map không sắp theo giá trị được, nên chép các cặp (món, số lượng) ra List rồi sắp.
    public List<Map.Entry<String, Integer>> banChayNhat(int n) {
        List<Map.Entry<String, Integer>> cap = new ArrayList<>(soLuongTheoMon().entrySet());
        cap.sort(Map.Entry.<String, Integer>comparingByValue(Comparator.reverseOrder()));
        return cap.subList(0, Math.min(n, cap.size()));
    }

    // Cuối ngày bỏ các đơn rỗng (khách mở đơn rồi không gọi món). Trả về số đơn đã bỏ.
    // removeIf thay cho vòng for-each có remove bên trong (vòng đó ném ConcurrentModificationException).
    public int boDonRong() {
        int truoc = theoMa.size();
        theoMa.values().removeIf(don -> don.getLines().isEmpty());
        choPhaChe.removeIf(ma -> !theoMa.containsKey(ma));
        return truoc - theoMa.size();
    }
}
