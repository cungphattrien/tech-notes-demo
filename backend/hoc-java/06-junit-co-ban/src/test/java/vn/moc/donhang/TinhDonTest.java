package vn.moc.donhang;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;

class TinhDonTest {

    @Test
    void tongTienCongTatCaCacDong() {
        // Đơn của Mai: 3 trà đào 45.000 và 1 cà phê sữa 35.000
        int[] soLuong = {3, 1};
        long[] donGia = {45_000, 35_000};

        long tong = TinhDon.tinhTongTien(soLuong, donGia);

        assertEquals(170_000, tong);
    }

    @Test
    void donDungNguongDuocGiam() {
        assertEquals(10_000, TinhDon.tinhGiamGia(100_000));
    }

    @Test
    void donDuoiNguongKhongDuocGiam() {
        assertEquals(0, TinhDon.tinhGiamGia(99_999));
    }

    @ParameterizedTest(name = "tổng {0} đồng thì giảm {1}")
    @CsvSource({
            "0,       0",
            "99999,   0",
            "100000,  10000",
            "170000,  17000",
            "100005,  10000"
    })
    @DisplayName("Giảm giá theo ngưỡng 100.000 đồng")
    void giamGiaTheoNguong(long tong, long giamMongDoi) {
        assertEquals(giamMongDoi, TinhDon.tinhGiamGia(tong));
    }

    @Test
    void haiMangLechDoDaiThiBaoLoi() {
        int[] soLuong = {3, 1};
        long[] donGia = {45_000};

        IllegalArgumentException loi = assertThrows(IllegalArgumentException.class,
                () -> TinhDon.tinhTongTien(soLuong, donGia));

        assertEquals("Có 2 số lượng nhưng 1 đơn giá", loi.getMessage());
    }
}
