package vn.moc.donhang;

import org.apache.commons.lang3.StringUtils;

// Việc DUY NHẤT của class này: biến một Order thành chữ trên phiếu.
// Order lo tính tiền, InPhieu lo trình bày. Đổi mẫu phiếu không chạm vào Order, đổi cách tính tiền không chạm vào đây.
public class InPhieu {

    private static final int RONG = 64;

    public String in(Order don) {
        StringBuilder sb = new StringBuilder();
        sb.append(StringUtils.center(" PHIẾU TÍNH TIỀN - QUÁN MỘC ", RONG, '=')).append('\n');
        sb.append("Khách: ").append(don.getCustomerName()).append('\n');
        for (OrderLine dong : don.getLines()) {
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
