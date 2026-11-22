package vn.moc.donhang;

// Đồ uống là một món (kế thừa MenuItem), có thêm cỡ ly. Ly lớn phụ thu 10.000 đồng.
public class DoUong extends MenuItem {
    static final long PHU_THU_LY_LON = 10_000;

    private final boolean lyLon;

    public DoUong(long id, String name, long price, boolean lyLon) {
        super(id, name, price);
        this.lyLon = lyLon;
    }

    public boolean isLyLon() {
        return lyLon;
    }

    @Override
    protected long phuThu() {
        if (lyLon) {
            return PHU_THU_LY_LON;
        }
        return 0;
    }

    @Override
    public String moTa() {
        if (lyLon) {
            return super.moTa() + " (ly lớn)";
        }
        return super.moTa();
    }
}
