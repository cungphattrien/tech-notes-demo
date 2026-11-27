package vn.moc.donhang.thunghiem;

import java.util.List;

// Cách sai cho chữ I: một interface "đầy đủ" cho mọi thứ bán được, gồm cả việc của quầy pha chế.
// Voucher bị buộc cài phutPhaChe(), và chỉ còn cách ném lỗi.
public class InterfaceBeo {

    interface MonDayDu {
        String moTa();

        long donGia();

        int phutPhaChe();
    }

    record TraDao() implements MonDayDu {
        public String moTa() { return "Trà đào"; }
        public long donGia() { return 45_000; }
        public int phutPhaChe() { return 3; }
    }

    record VoucherBeo(long menhGia) implements MonDayDu {
        public String moTa() { return "Voucher " + menhGia; }
        public long donGia() { return menhGia; }
        public int phutPhaChe() { throw new UnsupportedOperationException("Voucher không cần pha chế"); }
    }

    public static void main(String[] args) {
        List<MonDayDu> don = List.of(new TraDao(), new VoucherBeo(100_000), new TraDao());
        int tong = 0;
        for (MonDayDu m : don) {
            tong += m.phutPhaChe();            // quầy pha chế cộng thời gian cho cả đơn
        }
        System.out.println("Thời gian chờ: " + tong + " phút");
    }
}
