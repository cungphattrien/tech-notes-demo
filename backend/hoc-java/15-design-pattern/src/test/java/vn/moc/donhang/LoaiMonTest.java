package vn.moc.donhang;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;

class LoaiMonTest {

    @Test
    void banhGiuNguyenGiaVaTen() {
        MenuItem banh = new Banh(4, "Bánh mì que", 15_000);

        assertEquals(15_000, banh.donGia());
        assertEquals("Bánh mì que", banh.moTa());
    }

    @Test
    void doUongKhongTuyChonGiuGiaGoc() {
        MenuItem caPhe = new DoUong(1, "Cà phê sữa", 35_000);

        assertEquals(35_000, caPhe.donGia());
        assertEquals("Cà phê sữa", caPhe.moTa());
    }

    @Test
    void cacTuyChonCongDonPhuThu() {
        MenuItem traDao = new DoUong(3, "Trà đào", 45_000, TuyChon.LY_LON, TuyChon.DA, TuyChon.TRAN_CHAU);

        assertEquals(66_000, traDao.donGia()); // 45.000 + 10.000 + 3.000 + 8.000
        assertEquals("Trà đào (ly lớn, đá, trân châu)", traDao.moTa());
    }

    @Test
    void cungToppingThiCungGiaDuNongHayDa() {
        long da = new DoUong(3, "Trà đào", 45_000, TuyChon.DA, TuyChon.TRAN_CHAU).donGia();
        long thuong = new DoUong(3, "Trà đào", 45_000, TuyChon.TRAN_CHAU).donGia();

        assertEquals(TuyChon.DA.phuThu(), da - thuong);   // chỉ chênh đúng tiền ly nhựa
    }

    @Test
    void khongTheVuaNongVuaDa() {
        assertThrows(IllegalArgumentException.class,
                () -> new DoUong(1, "Cà phê sữa", 35_000, TuyChon.NONG, TuyChon.DA));
    }

    @Test
    void voucherKhongDuocGiamGia() {
        Order don = new Order("Hùng");
        don.themMon(new Voucher(100_000), 1);
        don.themMon(new DoUong(1, "Cà phê sữa", 35_000), 1);

        assertEquals(135_000, don.tongTien());
        assertEquals(0, don.giamGia());
    }

    @Test
    void comboTinhGiaLeTuThanhPhanVaKhongDuocGiamThem() {
        Combo combo = new Combo("SANG", "Combo sáng", 45_000,
                new Banh(4, "Bánh mì que", 15_000), new DoUong(1, "Cà phê sữa", 35_000, TuyChon.DA));

        assertEquals(53_000, combo.giaLe());     // 15.000 + 38.000
        assertEquals(45_000, combo.donGia());
        assertFalse(combo.duocGiamGia());
        assertEquals("Combo sáng: Bánh mì que + Cà phê sữa (đá)", combo.moTa());
    }

    @Test
    void comboDatHonMuaLeBiTuChoi() {
        assertThrows(IllegalArgumentException.class, () -> new Combo("SAI", "Combo sai", 60_000,
                new Banh(4, "Bánh mì que", 15_000), new DoUong(1, "Cà phê sữa", 35_000)));
    }

    @Test
    void monMacDinhDuocGiamGia() {
        CoTheBan banh = new Banh(4, "Bánh mì que", 15_000);

        assertTrue(banh.duocGiamGia());
        assertEquals("MON-4", banh.ma());
    }
}
