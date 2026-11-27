package vn.moc.donhang.thunghiem;

// Cách làm đầu tiên khi quán bắt đầu giao hàng: thêm tham số vào constructor.
// Ba tham số String đứng cạnh nhau: truyền nhầm thứ tự vẫn biên dịch được.
public class DonGiaoNhieuThamSo {
    final String khach;
    final String diaChiGiao;
    final String soDienThoai;
    final String ghiChu;

    public DonGiaoNhieuThamSo(String khach, String diaChiGiao, String soDienThoai, String ghiChu) {
        this.khach = khach;
        this.diaChiGiao = diaChiGiao;
        this.soDienThoai = soDienThoai;
        this.ghiChu = ghiChu;
    }

    public String phieuGiao() {
        return "Khách: " + khach + "\nGiao đến: " + diaChiGiao + "\nĐiện thoại: " + soDienThoai + "\nGhi chú: " + ghiChu;
    }
}
