package vn.moc.donhang;

// Phiên bản có lỗi logic: giảm giá theo TỪNG DÒNG thay vì theo tổng đơn.
public class GiamGiaLoi {

    static long tinhTienPhaiTra(int[] soLuong, long[] donGia) {
        long phaiTra = 0;
        for (int i = 0; i < soLuong.length; i++) {
            long thanhTien = soLuong[i] * donGia[i];
            if (thanhTien >= 100_000) {
                thanhTien = thanhTien - thanhTien * 10 / 100;
            }
            phaiTra += thanhTien;
        }
        return phaiTra;
    }

    public static void main(String[] args) {
        // Đơn của Mai: 3 trà đào (45000) + 1 cà phê sữa (35000). Tổng 170000, đáng ra giảm 17000.
        int[] soLuong = {3, 1};
        long[] donGia = {45_000, 35_000};
        System.out.println("Phải trả: " + tinhTienPhaiTra(soLuong, donGia));
    }
}
