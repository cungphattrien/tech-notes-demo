package vn.moc.donhang;

import java.util.Set;

// Khách quen (có trong danh sách) được giảm phần trăm cho mọi đơn.
public class GiamKhachQuen implements QuyTacGiamGia {

    private final Set<String> khachQuen;
    private final int phanTram;

    public GiamKhachQuen(Set<String> khachQuen, int phanTram) {
        this.khachQuen = Set.copyOf(khachQuen);
        this.phanTram = phanTram;
    }

    @Override
    public long giam(Order don) {
        if (khachQuen.contains(don.getCustomerName())) {
            return don.tongDuocGiamGia() * phanTram / 100;
        }
        return 0;
    }
}
