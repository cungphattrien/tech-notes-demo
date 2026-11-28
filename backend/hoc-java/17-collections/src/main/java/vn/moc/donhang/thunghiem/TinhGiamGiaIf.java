package vn.moc.donhang.thunghiem;

import java.time.LocalTime;
import vn.moc.donhang.Order;

// Cách làm đầu tiên: mọi quy tắc giảm giá dồn vào một method, thêm quy tắc là thêm tham số và thêm if.
public class TinhGiamGiaIf {

    public static long giam(Order don, boolean khachQuen, LocalTime gio) {
        long tong = don.tongDuocGiamGia();
        if (khachQuen) {
            return tong * 5 / 100;                       // khách quen: 5%
        }
        if (!gio.isBefore(LocalTime.of(14, 0)) && gio.isBefore(LocalTime.of(16, 0))) {
            return tong * 20 / 100;                      // giờ vàng 14:00-16:00: 20%
        }
        if (tong >= 100_000) {
            return tong * 10 / 100;                      // đơn từ 100.000: 10%
        }
        return 0;
    }
}
