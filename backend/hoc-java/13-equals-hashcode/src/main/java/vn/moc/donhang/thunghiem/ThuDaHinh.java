package vn.moc.donhang.thunghiem;

import java.util.List;
import vn.moc.donhang.Banh;
import vn.moc.donhang.DoUong;
import vn.moc.donhang.MenuItem;
import vn.moc.donhang.TuyChon;

// Bảng giá của bài trước, làm lại bằng một class DoUong và các tùy chọn: giá phải y hệt.
public class ThuDaHinh {

    public static void main(String[] args) {
        List<MenuItem> thucDon = List.of(
                new Banh(4, "Bánh mì que", 15_000),
                new DoUong(1, "Cà phê sữa", 35_000),
                new DoUong(1, "Cà phê sữa", 35_000, TuyChon.LY_LON),
                new DoUong(3, "Trà đào", 45_000, TuyChon.DA),
                new DoUong(3, "Trà đào", 45_000, TuyChon.LY_LON, TuyChon.DA),
                new DoUong(3, "Trà đào", 45_000, TuyChon.TRAN_CHAU),
                new DoUong(3, "Trà đào", 45_000, TuyChon.DA, TuyChon.TRAN_CHAU));

        for (MenuItem mon : thucDon) {
            System.out.printf("%-6s %-34s %,7d%n", mon.getClass().getSimpleName(), mon.moTa(), mon.donGia());
        }
    }
}
