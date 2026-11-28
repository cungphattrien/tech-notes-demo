package vn.moc.donhang;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.util.List;
import java.util.Map;
import java.util.Set;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class SoDonTrongNgayTest {

    ThucDon thucDon;
    SoDonTrongNgay so;

    @BeforeEach
    void chuanBi() {
        thucDon = ThucDon.cuaQuanMoc();
        so = new SoDonTrongNgay();
    }

    Order don(String khach, String ma, int soLuong) {
        Order d = new Order(khach);
        d.themMon(thucDon.goi(ma), soLuong);
        return d;
    }

    @Test
    void huyMotDonKhongLamLechMaCacDonKhac() {
        so.nhan(don("Lan", "tra-dao", 1));
        so.nhan(don("Mai", "tra-dao", 1));
        Order hung = don("Hùng", "tra-dao", 1);
        so.nhan(hung);

        assertEquals(true, so.huy(2));
        assertSame(hung, so.tim(3));          // bản List cũ trả về sai đơn ở đây
        assertNull(so.tim(2));
        assertFalse(so.huy(2));               // hủy lần hai: không còn gì để hủy
    }

    @Test
    void maKhongDungLaiSauKhiHuy() {
        so.nhan(don("Lan", "tra-dao", 1));
        so.huy(1);

        assertEquals(2, so.nhan(don("Mai", "tra-dao", 1)));
    }

    @Test
    void phaTheoThuTuNhanVaBoQuaDonDaHuy() {
        so.nhan(don("Lan", "tra-dao", 1));
        so.nhan(don("Mai", "tra-dao", 1));
        so.nhan(don("Hùng", "tra-dao", 1));
        so.huy(2);

        assertEquals(1L, so.phaTiep());
        assertEquals(3L, so.phaTiep());
        assertNull(so.phaTiep());
    }

    @Test
    void khachTrongNgayMoiNguoiMotLanTheoThuTuToi() {
        so.nhan(don("Mai", "tra-dao", 1));
        so.nhan(don("Lan", "tra-dao", 1));
        so.nhan(don("mai ", "ca-phe-sua", 1));
        so.nhan(don("Hùng", "tra-dao", 1));

        assertEquals(List.of("Mai", "Lan", "Hùng"), List.copyOf(so.khachTrongNgay()));
        assertEquals(2, so.donCua("MAI").size());
    }

    @Test
    void boDonRongKeCaKhiHaiDonRongNamCuoi() {
        so.nhan(don("Lan", "tra-dao", 1));
        so.nhan(don("Mai", "tra-dao", 1));
        so.nhan(new Order("Hùng"));           // hai đơn rỗng ở cuối: ca mà for-each bỏ sót đơn cuối
        so.nhan(new Order("Bảo"));

        assertEquals(2, so.boDonRong());
        assertEquals(2, so.soDon());
        assertEquals(2, so.soDonChoPha());
    }

    @Test
    void demSoLuongVaBanChayNhat() {
        so.nhan(don("Lan", "tra-dao", 2));
        so.nhan(don("Mai", "ca-phe-sua", 1));
        so.nhan(don("Hùng", "tra-dao", 1));
        so.nhan(don("Bảo", "banh-mi-que", 2));

        assertEquals(Map.of("Trà đào", 3, "Cà phê sữa", 1, "Bánh mì que", 2), so.soLuongTheoMon());
        List<Map.Entry<String, Integer>> top = so.banChayNhat(2);
        assertEquals("Trà đào", top.get(0).getKey());
        assertEquals("Bánh mì que", top.get(1).getKey());
        assertEquals(3, so.banChayNhat(10).size());
    }

    @Test
    void comboKhongKeThuTuGoiMon() {
        Order lan = don("Lan", "tra-dao", 1);
        lan.themMon(thucDon.goi("banh-mi-que"), 1);
        Order hung = don("Hùng", "banh-mi-que", 2);   // gọi bánh trước, trà đào sau
        hung.themMon(thucDon.goi("tra-dao"), 1);
        so.nhan(lan);
        so.nhan(hung);
        so.nhan(don("Mai", "tra-dao", 1));
        so.nhan(new Order("Bảo"));                     // đơn rỗng không phải combo nào

        Map<Set<String>, Integer> combo = so.demTheoCombo();

        assertEquals(2, combo.size());
        assertEquals(2, combo.get(Set.of("Trà đào", "Bánh mì que")));
        assertEquals(1, combo.get(Set.of("Trà đào")));
    }

    @Test
    void khoaCuaComboKhongSuaDuoc() {
        so.nhan(don("Lan", "tra-dao", 1));
        Set<String> khoa = so.demTheoCombo().keySet().iterator().next();

        // Khóa bất biến: không ai đổi được nó sau khi đã nằm trong map, nên không bao giờ bị "lạc".
        assertThrows(UnsupportedOperationException.class, () -> khoa.add("Cà phê sữa"));
    }
}
