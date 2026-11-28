package vn.moc.donhang.thunghiem;

import vn.moc.donhang.Order;
import vn.moc.donhang.QuyTacGiamGia;

// Phiếu giảm thẳng một số tiền. Bản này PHÁ hợp đồng của QuyTacGiamGia: không chặn ở mức tiền của đơn.
public class GiamCoDinhSai implements QuyTacGiamGia {

    private final long soTien;

    public GiamCoDinhSai(long soTien) {
        this.soTien = soTien;
    }

    @Override
    public long giam(Order don) {
        return soTien;
    }
}
