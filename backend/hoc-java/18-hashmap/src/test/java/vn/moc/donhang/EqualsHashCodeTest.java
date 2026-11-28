package vn.moc.donhang;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import org.junit.jupiter.api.Test;

class EqualsHashCodeTest {

    MenuItem traDaoDaTranChau() {
        return new DoUong(3, "Trà đào", 45_000, TuyChon.DA, TuyChon.TRAN_CHAU);
    }

    @Test
    void haiMonGiongNhauThiBangNhauVaCungHashCode() {
        MenuItem a = traDaoDaTranChau();
        MenuItem b = traDaoDaTranChau();

        assertEquals(a, b);
        assertEquals(a.hashCode(), b.hashCode());
    }

    @Test
    void thuTuTuyChonKhongQuanTrong() {
        MenuItem a = new DoUong(3, "Trà đào", 45_000, TuyChon.DA, TuyChon.TRAN_CHAU);
        MenuItem b = new DoUong(3, "Trà đào", 45_000, TuyChon.TRAN_CHAU, TuyChon.DA);

        assertEquals(a, b);
        assertEquals(a.hashCode(), b.hashCode());
    }

    @Test
    void khacTuyChonThiKhacMon() {
        assertNotEquals(traDaoDaTranChau(), new DoUong(3, "Trà đào", 45_000, TuyChon.DA));
    }

    @Test
    void khacLoaiThiKhongBangNhauCaHaiChieu() {
        MenuItem banh = new Banh(4, "Bánh mì que", 15_000);
        MenuItem doUong = new DoUong(4, "Bánh mì que", 15_000);

        assertFalse(banh.equals(doUong));
        assertFalse(doUong.equals(banh));
    }

    @Test
    void soVoiNullVaKieuKhacThiFalseKhongNem() {
        MenuItem mon = traDaoDaTranChau();

        assertFalse(mon.equals(null));
        assertFalse(mon.equals("Trà đào"));
    }

    @Test
    void hashMapDemDungSoLyTheoMon() {
        Map<MenuItem, Integer> soLy = new HashMap<>();
        for (MenuItem mon : List.of(traDaoDaTranChau(), new DoUong(1, "Cà phê sữa", 35_000), traDaoDaTranChau())) {
            soLy.merge(mon, 1, Integer::sum);
        }

        assertEquals(2, soLy.size());
        assertEquals(2, soLy.get(traDaoDaTranChau()));
    }

    @Test
    void hashSetTimThayMonTaoMoi() {
        Set<MenuItem> yeuThich = new HashSet<>(Set.of(new DoUong(1, "Cà phê sữa", 35_000)));

        assertTrue(yeuThich.contains(new DoUong(1, "Cà phê sữa", 35_000)));
    }

    @Test
    void voucherLaRecordTuCoEqualsVaToString() {
        assertEquals(new Voucher(100_000), new Voucher(100_000));
        assertEquals("Voucher[menhGia=100000]", new Voucher(100_000).toString());
    }

    @Test
    void toStringCuaDoUongDocDuoc() {
        assertEquals("DoUong[id=1, name=Cà phê sữa, price=35000, tuyChon=[TuyChon[ten=nóng, phuThu=0]]]",
                new DoUong(1, "Cà phê sữa", 35_000, TuyChon.NONG).toString());
    }
}
