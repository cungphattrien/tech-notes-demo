package vn.moc.donhang;

import java.time.Clock;
import java.time.LocalTime;

// Giờ vàng: trong khung giờ [tu, den) mọi đơn được giảm phần trăm.
// Giờ hiện tại lấy từ Clock được truyền vào (không gọi thẳng LocalTime.now()), để test đặt được giờ tùy ý.
public class GiamGioVang implements QuyTacGiamGia {

    private final LocalTime tu;
    private final LocalTime den;
    private final int phanTram;
    private final Clock dongHo;

    public GiamGioVang(LocalTime tu, LocalTime den, int phanTram, Clock dongHo) {
        this.tu = tu;
        this.den = den;
        this.phanTram = phanTram;
        this.dongHo = dongHo;
    }

    @Override
    public long giam(Order don) {
        LocalTime bayGio = LocalTime.now(dongHo);
        if (!bayGio.isBefore(tu) && bayGio.isBefore(den)) {
            return don.tongDuocGiamGia() * phanTram / 100;
        }
        return 0;
    }
}
