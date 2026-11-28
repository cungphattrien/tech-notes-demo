package vn.moc.donhang;

// Voucher quà tặng giờ là một record: chỉ là dữ liệu (mệnh giá), nên Java tự sinh constructor,
// menhGia(), equals, hashCode và toString đúng nghĩa. Record vẫn cài được interface và ghi đè default method.
public record Voucher(long menhGia) implements CoTheBan {

    public Voucher {
        if (menhGia <= 0) {
            throw new IllegalArgumentException("Mệnh giá phải lớn hơn 0: " + menhGia);
        }
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
