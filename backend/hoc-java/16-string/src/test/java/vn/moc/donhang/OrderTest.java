package vn.moc.donhang;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class OrderTest {

    MenuItem traDao;
    MenuItem caPheSua;

    @BeforeEach
    void taoThucDon() {
        traDao = new DoUong(3, "Trà đào", 45_000);
        caPheSua = new DoUong(1, "Cà phê sữa", 35_000);
    }

    @Test
    void donCuaMaiTinhDungTongGiamVaPhaiTra() {
        Order don = new Order("Mai");
        don.themMon(traDao, 3);
        don.themMon(caPheSua, 1);

        assertEquals(170_000, don.tongTien());
        assertEquals(17_000, don.giamGia());
        assertEquals(153_000, don.phaiTra());
    }

    @Test
    void soLuongKhongDuongThiBaoLoi() {
        Order don = new Order("Mai");

        assertThrows(IllegalArgumentException.class, () -> don.themMon(traDao, 0));
        assertEquals(0, don.getLines().size());
    }

    @Test
    void khongSuaDuocDanhSachDongTuBenNgoai() {
        Order don = new Order("Mai");
        don.themMon(traDao, 3);

        assertThrows(UnsupportedOperationException.class, () -> don.getLines().clear());
        assertEquals(135_000, don.tongTien());
    }

    @Test
    void tenKhachTrongThiBaoLoi() {
        assertThrows(IllegalArgumentException.class, () -> new Order("  "));
    }
}
