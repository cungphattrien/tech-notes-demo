package vn.moc.orderapi;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

// Cổng thanh toán GIẢ LẬP: demo không gọi cổng thật nào. Bật moc.thanh-toan.gia-lap-loi=true để mọi lần hoàn tiền đều lỗi,
// đặt moc.thanh-toan.do-tre-ms để mỗi lần hoàn tiền chờ thêm (giả lập cổng chậm).
@Component
public class CongThanhToanGiaLap implements CongThanhToan {

    private static final Logger log = LoggerFactory.getLogger(CongThanhToanGiaLap.class);

    private volatile boolean giaLapLoi;
    private final long doTreMs;

    public CongThanhToanGiaLap(@Value("${moc.thanh-toan.gia-lap-loi:false}") boolean giaLapLoi,
                               @Value("${moc.thanh-toan.do-tre-ms:0}") long doTreMs) {
        this.giaLapLoi = giaLapLoi;
        this.doTreMs = doTreMs;
    }

    // Cho test bật, tắt lỗi mà không phải khởi động lại ứng dụng.
    public void setGiaLapLoi(boolean giaLapLoi) {
        this.giaLapLoi = giaLapLoi;
    }

    @Override
    public void hoanTien(long orderId, long soTien) throws ThanhToanException {
        if (doTreMs > 0) {
            try {
                Thread.sleep(doTreMs);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
        if (giaLapLoi) {
            throw new ThanhToanException("Cổng thanh toán không phản hồi khi hoàn " + soTien + " đồng cho đơn " + orderId);
        }
        log.info("Đã hoàn {} đồng cho đơn {}", soTien, orderId);
    }
}
