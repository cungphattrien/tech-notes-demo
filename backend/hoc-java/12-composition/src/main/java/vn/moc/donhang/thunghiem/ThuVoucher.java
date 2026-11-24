package vn.moc.donhang.thunghiem;

import vn.moc.donhang.DoUong;
import vn.moc.donhang.Order;
import vn.moc.donhang.Voucher;

// Cùng một đơn: một voucher 100.000 và một cà phê sữa 35.000. So hai cách cài voucher.
public class ThuVoucher {

    public static void main(String[] args) {
        DoUong caPheSua = new DoUong(1, "Cà phê sữa", 35_000);

        Order keThua = new Order("Hùng");
        keThua.themMon(new VoucherKeThua(100_000), 1);
        keThua.themMon(caPheSua, 1);
        System.out.println("Voucher kế thừa MenuItem: mã " + keThua.getLines().get(0).getMa()
                + ", tổng " + keThua.tongTien() + ", giảm " + keThua.giamGia());

        Order quaInterface = new Order("Hùng");
        quaInterface.themMon(new Voucher(100_000), 1);
        quaInterface.themMon(caPheSua, 1);
        System.out.println("Voucher cài CoTheBan    : mã " + quaInterface.getLines().get(0).getMa()
                + ", tổng " + quaInterface.tongTien() + ", giảm " + quaInterface.giamGia());
    }
}
