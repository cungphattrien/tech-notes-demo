package vn.moc.donhang;

import java.time.Clock;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.Set;

// Ghép các phần: Factory (ThucDon) tạo món, Builder tạo đơn giao hàng, Strategy chọn cách giảm giá và thứ tự in.
public class App {
    public static void main(String[] args) {
        // Đồng hồ cố định 10:00 (ngoài giờ vàng) để chạy lần nào cũng ra cùng kết quả. Quán thật dùng Clock.systemDefaultZone().
        ZoneId vn = ZoneId.of("Asia/Ho_Chi_Minh");
        Clock dongHo = Clock.fixed(LocalDateTime.of(2026, 12, 3, 10, 0).atZone(vn).toInstant(), vn);

        // Strategy viết bằng lambda: khuyến mãi sinh nhật giảm thẳng 20.000, không quá phần được giảm.
        QuyTacGiamGia sinhNhat = don -> Math.min(20_000, don.tongDuocGiamGia());
        QuyTacGiamGia khuyenMaiHomNay = new GiamLonNhat(
                GiamTheoNguong.MAC_DINH,
                new GiamKhachQuen(Set.of("Lan", "Hùng"), 5),
                new GiamGioVang(LocalTime.of(14, 0), LocalTime.of(16, 0), 20, dongHo),
                sinhNhat);

        ThucDon thucDon = ThucDon.cuaQuanMoc();

        Order don = Order.choKhach("Hùng")
                .quyTac(khuyenMaiHomNay)
                .diaChiGiao("12 Lý Thường Kiệt, Quận 10")
                .soDienThoai("0901234567")
                .ghiChu("Ít đá, gọi trước khi tới")
                .tao();
        don.themMon(thucDon.goi("banh-mi-que"), 2);
        don.themMon(thucDon.goi("tra-dao", TuyChon.DA, TuyChon.TRAN_CHAU), 2);
        don.themMon(thucDon.goi("ca-phe-den", TuyChon.DA), 1);

        System.out.print(new InPhieu(InPhieu.DAT_TIEN_TRUOC).in(don));
    }
}
