package vn.moc.donhang;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.text.Normalizer;
import java.util.Set;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

class ChuanHoaTest {

    static final String HUNG_NFD = Normalizer.normalize("Hùng", Normalizer.Form.NFD);

    @Test
    void tenBoDauCachThuaVaGopDauCachGiua() {
        assertEquals("Nguyễn Văn Lan", ChuanHoa.ten("  Nguyễn   Văn  Lan "));
    }

    @Test
    void tenDuaUnicodeVeDangDungSan() {
        assertEquals(5, HUNG_NFD.length());
        assertEquals("Hùng", ChuanHoa.ten(HUNG_NFD));
        assertEquals(4, ChuanHoa.ten(HUNG_NFD).length());
    }

    @Test
    void khoaSoSanhKhongPhanBietHoaThuong() {
        assertEquals(ChuanHoa.khoaSoSanh("Lan"), ChuanHoa.khoaSoSanh(" LAN "));
        assertEquals("đức", ChuanHoa.khoaSoSanh("ĐỨC"));
    }

    @ParameterizedTest
    @ValueSource(strings = {"0901234567", "090 123 4567", "090.123.4567", "090-123-4567", "+84 90 123 4567", "84901234567"})
    void soDienThoaiNhieuCachGoCungMotKetQua(String cachGo) {
        assertEquals("0901234567", ChuanHoa.soDienThoai(cachGo));
    }

    @ParameterizedTest
    @ValueSource(strings = {"12 Lý Thường Kiệt", "090123456", "09012345678", "1901234567"})
    void soDienThoaiSaiVanBiTuChoi(String so) {
        IllegalArgumentException loi = assertThrows(IllegalArgumentException.class, () -> ChuanHoa.soDienThoai(so));
        assertEquals("Số điện thoại không hợp lệ: " + so, loi.getMessage());
    }

    @Test
    void khachQuenNhanRaDuGoKieuNao() {
        GiamKhachQuen khachQuen = new GiamKhachQuen(Set.of("Lan", "Hùng"), 5);
        for (String ten : new String[] {"Lan", "lan", "Lan ", "  LAN", HUNG_NFD}) {
            Order don = new Order(ten, khachQuen);
            don.themMon(ThucDon.cuaQuanMoc().goi("tra-dao"), 2);   // 90.000
            assertEquals(4_500, don.giamGia(), "khách: [" + ten + "]");
        }
    }

    @Test
    void orderLuuTenDaChuanHoa() {
        assertEquals("Lan", new Order("  Lan  ").getCustomerName());
        assertEquals("0901234567",
                Order.choKhach("Hùng").diaChiGiao(" 12  Lý Thường Kiệt ").soDienThoai("090 123 4567").tao().getSoDienThoai());
    }
}
