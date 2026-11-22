package vn.moc.donhang;

// Đồ uống đá là một đồ uống (kế thừa DoUong): phục vụ trong ly nhựa, cộng thêm 3.000 đồng tiền ly.
public class DoUongDa extends DoUong {
    static final long PHI_LY_NHUA = 3_000;

    public DoUongDa(long id, String name, long price, boolean lyLon) {
        super(id, name, price, lyLon);
    }

    @Override
    public long donGia() {
        return super.donGia() + PHI_LY_NHUA;   // giá của DoUong (đã tính cỡ ly) cộng tiền ly nhựa
    }

    @Override
    public String moTa() {
        return super.moTa() + ", đá";
    }
}
