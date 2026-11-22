package vn.moc.donhang.thunghiem;

import vn.moc.donhang.DoUong;
import vn.moc.donhang.MenuItem;
import vn.moc.donhang.Order;

// So sánh getter lộ danh sách bên trong (OrderLoGetter) với getter trả bản chỉ đọc (Order).
public class ThuDongGoi {

    public static void main(String[] args) {
        MenuItem traDao = new DoUong(3, "Trà đào", 45_000, false);

        OrderLoGetter loGetter = new OrderLoGetter();
        loGetter.themMon(traDao, 3);
        loGetter.getLines().clear();               // ai đó chỉ định "xem" các dòng món...
        System.out.println("OrderLoGetter sau clear(): tổng " + loGetter.tongTien());

        Order don = new Order("Mai");
        don.themMon(traDao, 3);
        try {
            don.getLines().clear();
        } catch (UnsupportedOperationException e) {
            System.out.println("Order: clear() bị chặn bằng " + e.getClass().getSimpleName());
        }
        System.out.println("Order vẫn còn: tổng " + don.tongTien());

        try {
            don.themMon(traDao, -1);
        } catch (IllegalArgumentException e) {
            System.out.println("themMon(-1): " + e.getMessage());
        }
    }
}
