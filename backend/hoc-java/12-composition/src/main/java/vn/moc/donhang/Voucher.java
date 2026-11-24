package vn.moc.donhang;

// Voucher quà tặng: khách mua để tặng người khác. Bán được, có giá, in lên phiếu,
// nhưng không phải là món, nên cài đặt CoTheBan chứ không kế thừa MenuItem.
public class Voucher implements CoTheBan {
    private final long menhGia;

    public Voucher(long menhGia) {
        if (menhGia <= 0) {
            throw new IllegalArgumentException("Mệnh giá phải lớn hơn 0: " + menhGia);
        }
        this.menhGia = menhGia;
    }

    @Override
    public String ma() {
        return "VOUCHER-" + menhGia;
    }

    @Override
    public String moTa() {
        return "Voucher quà tặng " + menhGia;
    }

    @Override
    public long donGia() {
        return menhGia;
    }

    // Giảm giá voucher thì quán bán 100.000 đồng tiền hàng với giá 90.000: không được.
    @Override
    public boolean duocGiamGia() {
        return false;
    }
}
