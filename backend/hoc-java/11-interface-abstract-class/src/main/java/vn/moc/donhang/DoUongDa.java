package vn.moc.donhang;

// Đồ uống đá là một đồ uống (kế thừa DoUong): thêm 3.000 đồng tiền ly nhựa vào phụ thu của DoUong.
public class DoUongDa extends DoUong {
    static final long PHI_LY_NHUA = 3_000;

    public DoUongDa(long id, String name, long price, boolean lyLon) {
        super(id, name, price, lyLon);
    }

    @Override
    protected long phuThu() {
        return super.phuThu() + PHI_LY_NHUA;
    }

    @Override
    public String moTa() {
        return super.moTa() + ", đá";
    }
}
