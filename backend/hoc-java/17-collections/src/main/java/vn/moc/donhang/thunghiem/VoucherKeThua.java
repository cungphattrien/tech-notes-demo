package vn.moc.donhang.thunghiem;

import vn.moc.donhang.MenuItem;

// Cách sai: cho voucher kế thừa MenuItem chỉ để có donGia() và moTa().
// Phải bịa ra một id món (0), và voucher nhận luôn mọi quy tắc của món, kể cả được giảm giá.
public class VoucherKeThua extends MenuItem {

    public VoucherKeThua(long menhGia) {
        super(0, "Voucher quà tặng " + menhGia, menhGia);
    }

    @Override
    protected long phuThu() {
        return 0;
    }
}
