package vn.moc.donhang.thunghiem;

import java.util.ArrayList;
import java.util.List;
import vn.moc.donhang.MenuItem;
import vn.moc.donhang.OrderLine;

// Giống Order nhưng getLines() trả thẳng danh sách bên trong. Xem ThuDongGoi.
public class OrderLoGetter {
    private final List<OrderLine> lines = new ArrayList<>();

    public void themMon(MenuItem item, int quantity) {
        lines.add(new OrderLine(item, quantity));
    }

    public List<OrderLine> getLines() {
        return lines; // lộ danh sách bên trong ra ngoài
    }

    public long tongTien() {
        long tong = 0;
        for (OrderLine dong : lines) {
            tong += dong.thanhTien();
        }
        return tong;
    }
}
