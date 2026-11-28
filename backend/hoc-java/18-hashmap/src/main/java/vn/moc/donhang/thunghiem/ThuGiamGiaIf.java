package vn.moc.donhang.thunghiem;

import java.time.LocalTime;
import vn.moc.donhang.DoUong;
import vn.moc.donhang.Order;
import vn.moc.donhang.TuyChon;

// Lan là khách quen, gọi 3 trà đào đá lúc 15:00 (giờ vàng). Quán muốn khách được mức có lợi nhất.
public class ThuGiamGiaIf {

    public static void main(String[] args) {
        Order don = new Order("Lan");
        don.themMon(new DoUong(3, "Trà đào", 45_000, TuyChon.DA), 3);   // 3 x 48.000 = 144.000

        long giam = TinhGiamGiaIf.giam(don, true, LocalTime.of(15, 0));
        System.out.println("Tổng " + don.tongTien() + ", giảm " + giam + " (mong đợi 20% = " + don.tongTien() * 20 / 100 + ")");
    }
}
