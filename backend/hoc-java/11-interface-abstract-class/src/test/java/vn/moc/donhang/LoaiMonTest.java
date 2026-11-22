package vn.moc.donhang;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

class LoaiMonTest {

    @Test
    void banhGiuNguyenGiaVaTen() {
        MenuItem banh = new Banh(4, "Bánh mì que", 15_000);

        assertEquals(15_000, banh.donGia());
        assertEquals("Bánh mì que", banh.moTa());
    }

    @Test
    void doUongLyLonCongThemMuoiNghin() {
        MenuItem lyThuong = new DoUong(1, "Cà phê sữa", 35_000, false);
        MenuItem lyLon = new DoUong(1, "Cà phê sữa", 35_000, true);

        assertEquals(35_000, lyThuong.donGia());
        assertEquals(45_000, lyLon.donGia());
        assertEquals("Cà phê sữa (ly lớn)", lyLon.moTa());
    }

    @Test
    void doUongDaCongTienLySauKhiTinhCoLy() {
        MenuItem daLyLon = new DoUongDa(3, "Trà đào", 45_000, true);

        assertEquals(58_000, daLyLon.donGia()); // 45.000 + 10.000 ly lớn + 3.000 ly nhựa
        assertEquals("Trà đào (ly lớn), đá", daLyLon.moTa());
    }

    @Test
    void orderLineChepGiaVaMoTaTheoLoaiMon() {
        Order don = new Order("Mai");
        don.themMon(new DoUongDa(3, "Trà đào", 45_000, true), 2);
        don.themMon(new Banh(4, "Bánh mì que", 15_000), 2);

        assertEquals(146_000, don.tongTien()); // 2 x 58.000 + 2 x 15.000
        assertEquals("Trà đào (ly lớn), đá", don.getLines().get(0).getItemName());
    }

    @Test
    void voucherKhongDuocGiamGia() {
        Order don = new Order("Hùng");
        don.themMon(new Voucher(100_000), 1);
        don.themMon(new DoUong(1, "Cà phê sữa", 35_000, false), 1);

        assertEquals(135_000, don.tongTien());
        assertEquals(35_000, don.tongDuocGiamGia());
        assertEquals(0, don.giamGia());          // 35.000 chưa tới ngưỡng 100.000
        assertEquals("VOUCHER-100000", don.getLines().get(0).getMa());
    }

    @Test
    void monMacDinhDuocGiamGia() {
        CoTheBan banh = new Banh(4, "Bánh mì que", 15_000);

        assertEquals(true, banh.duocGiamGia());
        assertEquals("MON-4", banh.ma());
    }
}
