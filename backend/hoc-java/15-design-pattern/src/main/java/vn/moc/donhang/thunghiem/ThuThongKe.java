package vn.moc.donhang.thunghiem;

import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import vn.moc.donhang.Banh;
import vn.moc.donhang.DoUong;
import vn.moc.donhang.MenuItem;
import vn.moc.donhang.TuyChon;

// Thống kê món bán chạy trong ngày: mỗi lần khách gọi món là một object MenuItem MỚI (như khi đọc từ phiếu),
// và ta đếm bằng HashMap<MenuItem, Integer>. Chỉ đúng khi MenuItem có equals và hashCode đúng.
public class ThuThongKe {

    public static void main(String[] args) {
        List<MenuItem> daBan = List.of(
                new DoUong(3, "Trà đào", 45_000, TuyChon.DA, TuyChon.TRAN_CHAU),
                new DoUong(1, "Cà phê sữa", 35_000),
                new DoUong(3, "Trà đào", 45_000, TuyChon.DA, TuyChon.TRAN_CHAU),
                new Banh(4, "Bánh mì que", 15_000),
                new DoUong(1, "Cà phê sữa", 35_000),
                new DoUong(3, "Trà đào", 45_000, TuyChon.DA, TuyChon.TRAN_CHAU));

        Map<MenuItem, Integer> soLy = new HashMap<>();
        for (MenuItem mon : daBan) {
            soLy.merge(mon, 1, Integer::sum);   // chưa có thì đặt 1, có rồi thì cộng thêm 1
        }
        System.out.println("Số món khác nhau: " + soLy.size());
        for (Map.Entry<MenuItem, Integer> dong : soLy.entrySet()) {
            System.out.println("  " + dong.getValue() + " x " + dong.getKey());
        }

        Set<MenuItem> monYeuThichCuaMai = new HashSet<>(Set.of(new DoUong(1, "Cà phê sữa", 35_000)));
        System.out.println("Mai thích cà phê sữa? " + monYeuThichCuaMai.contains(new DoUong(1, "Cà phê sữa", 35_000)));

        MenuItem banh = new Banh(4, "Bánh mì que", 15_000);
        MenuItem doUong = new DoUong(4, "Bánh mì que", 15_000);   // cùng id, tên, giá nhưng khác loại
        System.out.println("banh.equals(doUong) = " + banh.equals(doUong) + ", doUong.equals(banh) = " + doUong.equals(banh));
    }
}
