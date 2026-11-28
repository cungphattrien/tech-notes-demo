package vn.moc.orderapi;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

// Cổng thanh toán GIẢ LẬP: demo không gọi cổng thật nào. Bật moc.thanh-toan.gia-lap-loi=true để mọi lần hoàn tiền đều lỗi.
@Component
public class CongThanhToanGiaLap implements CongThanhToan {

    private static final Logger log = LoggerFactory.getLogger(CongThanhToanGiaLap.class);

    private volatile boolean giaLapLoi;

    public CongThanhToanGiaLap(@Value("${moc.thanh-toan.gia-lap-loi:false}") boolean giaLapLoi) {
        this.giaLapLoi = giaLapLoi;
    }

    // Cho test bật, tắt lỗi mà không phải khởi động lại ứng dụng.
    public void setGiaLapLoi(boolean giaLapLoi) {
        this.giaLapLoi = giaLapLoi;
    }

    @Override
    public void hoanTien(long orderId, long soTien) throws ThanhToanException {
        if (giaLapLoi) {
            throw new ThanhToanException("Cổng thanh toán không phản hồi khi hoàn " + soTien + " đồng cho đơn " + orderId);
        }
        log.info("Đã hoàn {} đồng cho đơn {}", soTien, orderId);
    }
}
