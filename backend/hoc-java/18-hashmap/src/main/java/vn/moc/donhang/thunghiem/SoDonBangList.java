package vn.moc.donhang.thunghiem;

import java.util.ArrayList;
import java.util.List;
import vn.moc.donhang.Order;
import vn.moc.donhang.ThucDon;

// Bản đầu tiên của sổ đơn: mọi đơn trong một ArrayList, mã đơn chính là vị trí trong danh sách cộng 1.
// Chạy đúng cho tới lần đầu tiên có đơn bị hủy.
public class SoDonBangList {

    private final List<Order> dons = new ArrayList<>();

    long nhan(Order don) {
        dons.add(don);
        return dons.size();             // đơn thứ 1 có mã 1, đơn thứ 2 có mã 2...
    }

    Order tim(long ma) {
        return dons.get((int) ma - 1);
    }

    void huy(long ma) {
        dons.remove((int) ma - 1);
    }

    public static void main(String[] args) {
        ThucDon thucDon = ThucDon.cuaQuanMoc();
        SoDonBangList so = new SoDonBangList();
        for (String khach : new String[] {"Lan", "Mai", "Hùng", "Bảo"}) {
            Order don = new Order(khach);
            don.themMon(thucDon.goi("tra-dao"), 1);
            System.out.println("Nhận đơn mã " + so.nhan(don) + " của " + khach);
        }

        System.out.println("Tìm mã 3: " + so.tim(3).getCustomerName());
        so.huy(2);
        System.out.println("Đã hủy mã 2 (Mai)");
        System.out.println("Tìm mã 3: " + so.tim(3).getCustomerName());
        System.out.println("Tìm mã 4: " + so.tim(4).getCustomerName());
    }
}
