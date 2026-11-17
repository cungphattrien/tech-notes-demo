package vn.moc.donhang;

// Bản đã sửa: cộng tổng đơn trước, rồi mới xét giảm giá một lần cho cả đơn.
public class GiamGiaDung {

    public static void main(String[] args) {
        int[] soLuong = {3, 1};
        long[] donGia = {45_000, 35_000};

        long tong = TinhDon.tinhTongTien(soLuong, donGia);
        long giam = TinhDon.tinhGiamGia(tong);
        System.out.println("Tổng " + tong + ", giảm " + giam + ", phải trả: " + (tong - giam));
    }
}
