package vn.moc.donhang;

import org.apache.commons.lang3.StringUtils;

public class App {
    public static void main(String[] args) {
        MenuItem traDaoLonDaTranChau = new DoUong(3, "Trà đào", 45_000, TuyChon.LY_LON, TuyChon.DA, TuyChon.TRAN_CHAU);
        MenuItem caPheSuaNong = new DoUong(1, "Cà phê sữa", 35_000, TuyChon.NONG);
        Combo comboSang = new Combo("SANG", "Combo sáng", 45_000,
                new Banh(4, "Bánh mì que", 15_000), new DoUong(1, "Cà phê sữa", 35_000, TuyChon.DA));

        Order don = new Order("Mai");
        don.themMon(traDaoLonDaTranChau, 2);
        don.themMon(caPheSuaNong, 1);
        don.themMon(comboSang, 1);
        don.themMon(new Voucher(100_000), 1);   // Mai mua thêm một voucher tặng bạn

        System.out.println(StringUtils.center(" PHIẾU TÍNH TIỀN - QUÁN MỘC ", 64, '='));
        System.out.println("Khách: " + don.getCustomerName());
        for (OrderLine dong : don.getLines()) {
            System.out.println(StringUtils.rightPad(dong.getQuantity() + " x " + dong.getItemName(), 54)
                    + StringUtils.leftPad(String.valueOf(dong.thanhTien()), 10));
        }
        System.out.println(StringUtils.repeat('-', 64));
        System.out.println(StringUtils.rightPad("Tổng", 54) + StringUtils.leftPad(String.valueOf(don.tongTien()), 10));
        System.out.println("  (được giảm giá: " + don.tongDuocGiamGia() + ")");
        System.out.println(StringUtils.rightPad("Giảm 10%", 54) + StringUtils.leftPad("-" + don.giamGia(), 10));
        System.out.println(StringUtils.rightPad("Phải trả", 54) + StringUtils.leftPad(String.valueOf(don.phaiTra()), 10));
    }
}
