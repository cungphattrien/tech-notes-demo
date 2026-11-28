package vn.moc.donhang.thunghiem;

import java.util.ArrayList;
import java.util.ConcurrentModificationException;
import java.util.List;
import vn.moc.donhang.Order;
import vn.moc.donhang.ThucDon;

// Cuối ngày bỏ các đơn rỗng (khách mở đơn rồi không gọi món) khỏi danh sách.
// Cách tự nhiên nhất là for-each rồi remove bên trong vòng lặp. Thử với hai danh sách khác nhau.
public class ThuXoaTrongVongLap {

    static List<Order> taoDanhSach(String... khach) {
        ThucDon thucDon = ThucDon.cuaQuanMoc();
        List<Order> dons = new ArrayList<>();
        for (String k : khach) {
            Order don = new Order(k.replace("*", ""));
            if (!k.endsWith("*")) {                // tên có dấu * là đơn rỗng
                don.themMon(thucDon.goi("ca-phe-sua"), 1);
            }
            dons.add(don);
        }
        return dons;
    }

    static void boDonRongBangForEach(List<Order> dons) {
        for (Order don : dons) {
            if (don.getLines().isEmpty()) {
                dons.remove(don);
            }
        }
    }

    static List<String> ten(List<Order> dons) {
        List<String> ds = new ArrayList<>();
        for (Order d : dons) {
            ds.add(d.getCustomerName() + (d.getLines().isEmpty() ? " (rỗng)" : ""));
        }
        return ds;
    }

    public static void main(String[] args) {
        List<Order> a = taoDanhSach("Lan", "Mai*", "Hùng", "Bảo");
        try {
            boDonRongBangForEach(a);
            System.out.println("A, for-each: " + ten(a));
        } catch (ConcurrentModificationException e) {
            System.out.println("A, for-each: " + e);
        }

        List<Order> b = taoDanhSach("Lan", "Mai", "Hùng*", "Bảo*");
        boDonRongBangForEach(b);
        System.out.println("B, for-each: " + ten(b));

        List<Order> c = taoDanhSach("Lan", "Mai", "Hùng*", "Bảo*");
        c.removeIf(don -> don.getLines().isEmpty());
        System.out.println("B, removeIf: " + ten(c));
    }
}
