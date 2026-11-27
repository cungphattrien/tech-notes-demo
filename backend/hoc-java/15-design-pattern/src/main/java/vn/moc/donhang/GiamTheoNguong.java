package vn.moc.donhang;

// Quy tắc cũ của quán: đơn từ ngưỡng trở lên được giảm phần trăm, tính trên phần được giảm của đơn.
public class GiamTheoNguong implements QuyTacGiamGia {

    public static final GiamTheoNguong MAC_DINH = new GiamTheoNguong(100_000, 10);

    private final long nguong;
    private final int phanTram;

    public GiamTheoNguong(long nguong, int phanTram) {
        this.nguong = nguong;
        this.phanTram = phanTram;
    }

    @Override
    public long giam(Order don) {
        long tong = don.tongDuocGiamGia();
        if (tong >= nguong) {
            return tong * phanTram / 100;
        }
        return 0;
    }
}
