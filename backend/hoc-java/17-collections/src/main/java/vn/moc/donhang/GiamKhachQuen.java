package vn.moc.donhang;

import java.util.HashSet;
import java.util.Set;

// Khách quen (có trong danh sách) được giảm phần trăm cho mọi đơn.
// So theo khóa chuẩn hóa (ChuanHoa.khoaSoSanh): "lan", "Lan " và "Lan" là cùng một khách.
public class GiamKhachQuen implements QuyTacGiamGia {

    private final Set<String> khachQuen;
    private final int phanTram;

    public GiamKhachQuen(Set<String> khachQuen, int phanTram) {
        Set<String> khoa = new HashSet<>();
        for (String ten : khachQuen) {
            khoa.add(ChuanHoa.khoaSoSanh(ten));
        }
        this.khachQuen = Set.copyOf(khoa);
        this.phanTram = phanTram;
    }

    @Override
    public long giam(Order don) {
        if (khachQuen.contains(ChuanHoa.khoaSoSanh(don.getCustomerName()))) {
            return don.tongDuocGiamGia() * phanTram / 100;
        }
        return 0;
    }
}
