package vn.moc.donhang;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertInstanceOf;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;

class DesignPatternTest {

    ThucDon thucDon = ThucDon.cuaQuanMoc();

    // ---------- Builder ----------

    @Test
    void builderTaoDonGiaoDayDu() {
        Order don = Order.choKhach("Hùng")
                .diaChiGiao("12 Lý Thường Kiệt, Quận 10")
                .soDienThoai("0901234567")
                .ghiChu("Ít đá")
                .tao();

        assertTrue(don.laDonGiao());
        assertEquals("0901234567", don.getSoDienThoai());
        assertEquals("Ít đá", don.getGhiChu());
    }

    @Test
    void builderKhongCoDiaChiLaDonTaiQuan() {
        Order don = Order.choKhach("Mai").tao();

        assertFalse(don.laDonGiao());
        don.themMon(thucDon.goi("tra-dao"), 3);
        assertEquals(13_500, don.giamGia());   // mặc định vẫn là từ 100.000 giảm 10%
    }

    @Test
    void builderTuChoiSoDienThoaiSai() {
        IllegalArgumentException loi = assertThrows(IllegalArgumentException.class,
                () -> Order.choKhach("Hùng").soDienThoai("12 Lý Thường Kiệt, Quận 10"));

        assertEquals("Số điện thoại không hợp lệ: 12 Lý Thường Kiệt, Quận 10", loi.getMessage());
    }

    @Test
    void builderTuChoiDiaChiMaThieuSoDienThoai() {
        IllegalStateException loi = assertThrows(IllegalStateException.class,
                () -> Order.choKhach("Hùng").diaChiGiao("12 Lý Thường Kiệt, Quận 10").tao());

        assertEquals("Đơn giao hàng cần cả địa chỉ và số điện thoại", loi.getMessage());
    }

    // ---------- Factory ----------

    @Test
    void thucDonTaoDungLoaiVaGia() {
        MenuItem traDao = thucDon.goi("tra-dao", TuyChon.DA);
        MenuItem banh = thucDon.goi("banh-mi-que");

        assertInstanceOf(DoUong.class, traDao);
        assertInstanceOf(Banh.class, banh);
        assertEquals(48_000, traDao.donGia());
        assertEquals(new DoUong(3, "Trà đào", 45_000, TuyChon.DA), traDao);
    }

    @Test
    void thucDonBaoLoiMaKhongCo() {
        IllegalArgumentException loi = assertThrows(IllegalArgumentException.class, () -> thucDon.goi("tra-sua"));

        assertTrue(loi.getMessage().startsWith("Không có món mã tra-sua"));
    }

    @Test
    void banhKhongNhanTuyChon() {
        IllegalArgumentException loi = assertThrows(IllegalArgumentException.class,
                () -> thucDon.goi("banh-mi-que", TuyChon.DA));

        assertEquals("Bánh mì que không có tùy chọn", loi.getMessage());
    }

    // ---------- Strategy ----------

    @Test
    void inPhieuTheoThuTuDuocChon() {
        Order don = Order.choKhach("Mai").quyTac(QuyTacGiamGia.KHONG_GIAM).tao();
        don.themMon(thucDon.goi("banh-mi-que"), 1);   // 15.000
        don.themMon(thucDon.goi("tra-dao"), 2);       // 90.000

        String theoGoi = new InPhieu().in(don);
        String datTruoc = new InPhieu(InPhieu.DAT_TIEN_TRUOC).in(don);

        assertTrue(theoGoi.indexOf("Bánh mì que") < theoGoi.indexOf("Trà đào"));
        assertTrue(datTruoc.indexOf("Trà đào") < datTruoc.indexOf("Bánh mì que"));
    }

    @Test
    void lambdaCungLaMotQuyTac() {
        QuyTacGiamGia sinhNhat = don -> Math.min(20_000, don.tongDuocGiamGia());
        Order don = Order.choKhach("Mai").quyTac(sinhNhat).tao();
        don.themMon(thucDon.goi("banh-mi-que"), 1);

        assertEquals(15_000, don.giamGia());
        assertEquals(0, don.phaiTra());
    }
}
