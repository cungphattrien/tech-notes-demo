package vn.moc.donhang;

public class TinhDon {
    static final long NGUONG_GIAM_GIA = 100_000;
    static final int PHAN_TRAM_GIAM = 10;

    // Cộng thành tiền của từng dòng món. Hai mảng phải dài bằng nhau: dòng i có soLuong[i] và donGia[i].
    public static long tinhTongTien(int[] soLuong, long[] donGia) {
        if (soLuong.length != donGia.length) {
            throw new IllegalArgumentException(
                    "Có " + soLuong.length + " số lượng nhưng " + donGia.length + " đơn giá");
        }
        long tong = 0;
        for (int i = 0; i < soLuong.length; i++) {
            tong += soLuong[i] * donGia[i];
        }
        return tong;
    }

    // Đơn từ 100.000 đồng trở lên được giảm 10%, tính trên tổng cả đơn.
    public static long tinhGiamGia(long tongTien) {
        if (tongTien >= NGUONG_GIAM_GIA) {
            return tongTien * PHAN_TRAM_GIAM / 100;
        }
        return 0;
    }
}
