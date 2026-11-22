package vn.moc.donhang.thunghiem;

import java.util.List;
import vn.moc.donhang.Banh;
import vn.moc.donhang.DoUong;
import vn.moc.donhang.DoUongDa;
import vn.moc.donhang.MenuItem;

// Cùng một biến kiểu MenuItem, cùng một lời gọi donGia(), nhưng mỗi object chạy method của chính class nó.
public class ThuDaHinh {

    public static void main(String[] args) {
        List<MenuItem> thucDon = List.of(
                new Banh(4, "Bánh mì que", 15_000),
                new DoUong(1, "Cà phê sữa", 35_000, false),
                new DoUong(1, "Cà phê sữa", 35_000, true),
                new DoUongDa(3, "Trà đào", 45_000, false),
                new DoUongDa(3, "Trà đào", 45_000, true));

        for (MenuItem mon : thucDon) {
            System.out.printf("%-9s %-28s %,7d%n", mon.getClass().getSimpleName(), mon.moTa(), mon.donGia());
        }

        MenuItem mon = new DoUongDa(3, "Trà đào", 45_000, true);
        System.out.println("mon instanceof DoUong   : " + (mon instanceof DoUong));
        System.out.println("mon instanceof Banh     : " + (mon instanceof Banh));
        System.out.println("mon.getPrice() (giá gốc): " + mon.getPrice());
    }
}
