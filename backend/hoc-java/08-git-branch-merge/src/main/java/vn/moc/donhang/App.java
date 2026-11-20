package vn.moc.donhang;

import org.apache.commons.lang3.StringUtils;

public class App {
    public static void main(String[] args) {
        String[] mon = {"Cà phê sữa", "Bánh mì que"};
        int[] soLuong = {2, 2};
        long[] donGia = {35_000, 15_000};

        System.out.println(StringUtils.center(" PHIẾU TÍNH TIỀN - QUÁN MỘC ", 40, '='));
        for (int i = 0; i < mon.length; i++) {
            long thanhTien = soLuong[i] * donGia[i];
            System.out.println(StringUtils.rightPad(soLuong[i] + " x " + mon[i], 28)
                    + StringUtils.leftPad(String.valueOf(thanhTien), 12));
        }

        long tong = TinhDon.tinhTongTien(soLuong, donGia);
        long giam = TinhDon.tinhGiamGia(tong);
        System.out.println(StringUtils.repeat('-', 40));
        System.out.println(StringUtils.rightPad("Tổng", 28) + StringUtils.leftPad(String.valueOf(tong), 12));
        System.out.println(StringUtils.rightPad("Giảm 10%", 28) + StringUtils.leftPad("-" + giam, 12));
        System.out.println(StringUtils.rightPad("Phải trả", 28) + StringUtils.leftPad(String.valueOf(tong - giam), 12));
    }
}
