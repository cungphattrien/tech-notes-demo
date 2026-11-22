package vn.moc.donhang;

import org.apache.commons.lang3.StringUtils;

public class App {
    public static void main(String[] args) {
        MenuItem traDaoLon = new DoUongDa(3, "Trà đào", 45_000, true);
        MenuItem caPheSua = new DoUong(1, "Cà phê sữa", 35_000, false);
        MenuItem banhMiQue = new Banh(4, "Bánh mì que", 15_000);

        Order don = new Order("Mai");
        don.themMon(traDaoLon, 2);
        don.themMon(caPheSua, 1);
        don.themMon(banhMiQue, 2);

        System.out.println(StringUtils.center(" PHIẾU TÍNH TIỀN - QUÁN MỘC ", 40, '='));
        System.out.println("Khách: " + don.getCustomerName());
        for (OrderLine dong : don.getLines()) {
            System.out.println(StringUtils.rightPad(dong.getQuantity() + " x " + dong.getItemName(), 28)
                    + StringUtils.leftPad(String.valueOf(dong.thanhTien()), 12));
        }
        System.out.println(StringUtils.repeat('-', 40));
        System.out.println(StringUtils.rightPad("Tổng", 28) + StringUtils.leftPad(String.valueOf(don.tongTien()), 12));
        System.out.println(StringUtils.rightPad("Giảm 10%", 28) + StringUtils.leftPad("-" + don.giamGia(), 12));
        System.out.println(StringUtils.rightPad("Phải trả", 28) + StringUtils.leftPad(String.valueOf(don.phaiTra()), 12));
    }
}
