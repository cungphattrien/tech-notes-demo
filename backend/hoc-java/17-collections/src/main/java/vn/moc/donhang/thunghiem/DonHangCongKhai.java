package vn.moc.donhang.thunghiem;

import java.util.ArrayList;
import java.util.List;

// Cách làm đầu tiên: một class chỉ để gom dữ liệu, mọi trường đều public. Xem ThuDonHangCongKhai.
public class DonHangCongKhai {
    public String tenKhach;
    public List<String> tenMon = new ArrayList<>();
    public List<Integer> soLuong = new ArrayList<>();
    public List<Long> donGia = new ArrayList<>();

    public long tongTien() {
        long tong = 0;
        for (int i = 0; i < tenMon.size(); i++) {
            tong += soLuong.get(i) * donGia.get(i);
        }
        return tong;
    }
}
