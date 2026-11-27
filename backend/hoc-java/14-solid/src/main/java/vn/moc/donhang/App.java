package vn.moc.donhang;

import java.time.Clock;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.List;
import java.util.Set;

// Nơi DUY NHẤT ghép các phần lại: chọn quy tắc giảm giá, tạo đơn, in phiếu.
// Order không tự tạo quy tắc; App quyết định và truyền vào (dependency inversion).
public class App {
    public static void main(String[] args) {
        // Đồng hồ cố định 15:00 để chạy lần nào cũng ra cùng kết quả. Quán thật dùng Clock.systemDefaultZone().
        ZoneId vn = ZoneId.of("Asia/Ho_Chi_Minh");
        Clock dongHo = Clock.fixed(LocalDateTime.of(2026, 12, 2, 15, 0).atZone(vn).toInstant(), vn);

        QuyTacGiamGia khuyenMaiHomNay = new GiamLonNhat(
                GiamTheoNguong.MAC_DINH,
                new GiamKhachQuen(Set.of("Lan", "Hùng"), 5),
                new GiamGioVang(LocalTime.of(14, 0), LocalTime.of(16, 0), 20, dongHo));

        DoUong traDao = new DoUong(3, "Trà đào", 45_000, TuyChon.DA);
        DoUong caPheSua = new DoUong(1, "Cà phê sữa", 35_000, TuyChon.NONG);
        Banh banhMiQue = new Banh(4, "Bánh mì que", 15_000);

        Order don = new Order("Lan", khuyenMaiHomNay);
        don.themMon(traDao, 3);
        don.themMon(caPheSua, 1);
        don.themMon(banhMiQue, 1);

        System.out.print(new InPhieu().in(don));
        System.out.println("Thời gian chờ ước tính: "
                + UocTinhThoiGian.phutCho(List.of(traDao, traDao, traDao, caPheSua, banhMiQue)) + " phút");
    }
}
