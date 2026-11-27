package vn.moc.donhang;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import org.apache.commons.lang3.StringUtils;

// Việc DUY NHẤT của class này: biến một Order thành chữ trên phiếu.
// Thứ tự các dòng là một strategy (Comparator) truyền từ ngoài vào: quầy muốn theo thứ tự gọi, thu ngân muốn món đắt lên đầu.
public class InPhieu {

    private static final int RONG = 64;

    // Giữ nguyên thứ tự gọi món: List.sort là sắp xếp ổn định, hai dòng "bằng nhau" thì không đổi chỗ.
    public static final Comparator<OrderLine> THEO_THU_TU_GOI = (a, b) -> 0;
    public static final Comparator<OrderLine> DAT_TIEN_TRUOC = Comparator.comparingLong(OrderLine::thanhTien).reversed();

    private final Comparator<OrderLine> thuTu;

    public InPhieu() {
        this(THEO_THU_TU_GOI);
    }

    public InPhieu(Comparator<OrderLine> thuTu) {
        this.thuTu = thuTu;
    }

    public String in(Order don) {
        StringBuilder sb = new StringBuilder();
        sb.append(StringUtils.center(" PHIẾU TÍNH TIỀN - QUÁN MỘC ", RONG, '=')).append('\n');
        sb.append("Khách: ").append(don.getCustomerName()).append('\n');
        if (don.laDonGiao()) {
            sb.append("Giao đến: ").append(don.getDiaChiGiao()).append('\n');
            sb.append("Điện thoại: ").append(don.getSoDienThoai()).append('\n');
        }
        if (don.getGhiChu() != null) {
            sb.append("Ghi chú: ").append(don.getGhiChu()).append('\n');
        }
        List<OrderLine> dongs = new ArrayList<>(don.getLines());
        dongs.sort(thuTu);
        for (OrderLine dong : dongs) {
            sb.append(dong(dong.getQuantity() + " x " + dong.getItemName(), String.valueOf(dong.thanhTien())));
        }
        sb.append(StringUtils.repeat('-', RONG)).append('\n');
        sb.append(dong("Tổng", String.valueOf(don.tongTien())));
        sb.append(dong("Giảm giá", "-" + don.giamGia()));
        sb.append(dong("Phải trả", String.valueOf(don.phaiTra())));
        return sb.toString();
    }

    private String dong(String trai, String phai) {
        return StringUtils.rightPad(trai, RONG - 10) + StringUtils.leftPad(phai, 10) + '\n';
    }
}
