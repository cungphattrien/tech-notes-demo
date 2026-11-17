package vn.moc.donhang;

public class TinhDon {
    static final long NGUONG_GIAM_GIA = 100_000;
    static final int PHAN_TRAM_GIAM = 10;

    public static long tinhTongTien(int[] soLuong, long[] donGia) {
        long tong = 0;
        for (int i = 0; i < soLuong.length; i++) {
            tong += soLuong[i] * donGia[i];
        }
        return tong;
    }

    public static long tinhGiamGia(long tongTien) {
        if (tongTien >= NGUONG_GIAM_GIA) {
            return tongTien * PHAN_TRAM_GIAM / 100;
        }
        return 0;
    }
}
