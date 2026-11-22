package vn.moc.donhang;

// Đồ uống là một món (kế thừa MenuItem), có thêm cỡ ly. Ly lớn cộng thêm 10.000 đồng.
public class DoUong extends MenuItem {
    static final long PHU_THU_LY_LON = 10_000;

    private final boolean lyLon;

    public DoUong(long id, String name, long price, boolean lyLon) {
        super(id, name, price);   // để MenuItem kiểm tra và gán id, tên, giá
        this.lyLon = lyLon;
    }

    public boolean isLyLon() {
        return lyLon;
    }

    @Override
    public long donGia() {
        if (lyLon) {
            return super.donGia() + PHU_THU_LY_LON;
        }
        return super.donGia();
    }

    @Override
    public String moTa() {
        if (lyLon) {
            return super.moTa() + " (ly lớn)";
        }
        return super.moTa();
    }
}
