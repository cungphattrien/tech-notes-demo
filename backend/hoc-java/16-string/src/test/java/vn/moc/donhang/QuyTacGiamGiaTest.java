package vn.moc.donhang;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.time.Clock;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.List;
import java.util.Set;
import java.util.stream.Stream;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;

class QuyTacGiamGiaTest {

    static final ZoneId VN = ZoneId.of("Asia/Ho_Chi_Minh");

    static Clock luc(int gio, int phut) {
        return Clock.fixed(LocalDateTime.of(2026, 12, 2, gio, phut).atZone(VN).toInstant(), VN);
    }

    static GiamGioVang gioVangLuc(int gio, int phut) {
        return new GiamGioVang(LocalTime.of(14, 0), LocalTime.of(16, 0), 20, luc(gio, phut));
    }

    static Order donCua(String khach, QuyTacGiamGia quyTac, CoTheBan hang, int soLuong) {
        Order don = new Order(khach, quyTac);
        don.themMon(hang, soLuong);
        return don;
    }

    static final DoUong TRA_DAO_DA = new DoUong(3, "Trà đào", 45_000, TuyChon.DA);   // 48.000
    static final DoUong CA_PHE = new DoUong(1, "Cà phê sữa", 35_000);

    // Mọi cách cài QuyTacGiamGia trong code chính. Cài mới thì thêm vào đây, và hợp đồng tự được kiểm.
    static List<QuyTacGiamGia> cacQuyTac() {
        return List.of(
                GiamTheoNguong.MAC_DINH,
                new GiamKhachQuen(Set.of("Lan"), 5),
                gioVangLuc(15, 0),
                new GiamCoDinh(50_000),
                new GiamLonNhat(GiamTheoNguong.MAC_DINH, new GiamCoDinh(50_000)),
                QuyTacGiamGia.KHONG_GIAM,
                don -> Math.min(20_000, don.tongDuocGiamGia()));   // strategy viết bằng lambda (sinh nhật)
    }

    static Stream<Arguments> quyTacVaDon() {
        return cacQuyTac().stream().flatMap(q -> Stream.of(
                Arguments.of(q, donCua("Lan", q, CA_PHE, 1)),             // đơn nhỏ 35.000
                Arguments.of(q, donCua("Lan", q, new Voucher(100_000), 1)),  // chỉ có voucher
                Arguments.of(q, donCua("Lan", q, TRA_DAO_DA, 3))));       // đơn lớn 144.000
    }

    // Liskov: thay quy tắc nào vào Order cũng phải giữ 0 <= giảm <= phần được giảm.
    @ParameterizedTest
    @MethodSource("quyTacVaDon")
    void moiQuyTacGiuDungHopDong(QuyTacGiamGia quyTac, Order don) {
        long giam = quyTac.giam(don);

        assertTrue(giam >= 0, "giảm âm: " + giam);
        assertTrue(giam <= don.tongDuocGiamGia(), "giảm " + giam + " > phần được giảm " + don.tongDuocGiamGia());
        assertTrue(don.phaiTra() >= 0, "phải trả âm: " + don.phaiTra());
    }

    @Test
    void gioVangTinhDungORanhGioi() {
        Order don = new Order("Mai");
        don.themMon(TRA_DAO_DA, 3);   // 144.000

        assertEquals(0, gioVangLuc(13, 59).giam(don));
        assertEquals(28_800, gioVangLuc(14, 0).giam(don));
        assertEquals(28_800, gioVangLuc(15, 59).giam(don));
        assertEquals(0, gioVangLuc(16, 0).giam(don));
    }

    @Test
    void khachQuenGioVangDuocMucLonNhat() {
        QuyTacGiamGia homNay = new GiamLonNhat(GiamTheoNguong.MAC_DINH, new GiamKhachQuen(Set.of("Lan"), 5),
                gioVangLuc(15, 0));

        assertEquals(28_800, donCua("Lan", homNay, TRA_DAO_DA, 3).giamGia());   // 20%, không phải 5%
    }

    @Test
    void giamCoDinhKhongVuotQuaTienDon() {
        Order don = donCua("Mai", new GiamCoDinh(50_000), CA_PHE, 1);

        assertEquals(35_000, don.giamGia());
        assertEquals(0, don.phaiTra());
    }

    @Test
    void inPhieuChiDocOrderKhongTinhLai() {
        Order don = donCua("Mai", QuyTacGiamGia.KHONG_GIAM, CA_PHE, 2);

        String phieu = new InPhieu().in(don);

        assertTrue(phieu.contains("Khách: Mai"));
        assertTrue(phieu.contains("2 x Cà phê sữa"));
        assertTrue(phieu.contains("70000"));
    }

    @Test
    void thoiGianChoCongPhutTungMon() {
        assertEquals(4 + 3 + 1, UocTinhThoiGian.phutCho(List.of(TRA_DAO_DA, CA_PHE, new Banh(4, "Bánh mì que", 15_000))));
    }
}
