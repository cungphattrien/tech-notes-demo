package vn.moc.orderapi.thuchanh;

import ch.qos.logback.classic.Level;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

// Chạy riêng, không cần Spring: so sánh nối chuỗi với {} và cách ghi log một exception.
public class ThuLog {

    private static final Logger log = LoggerFactory.getLogger(ThuLog.class);

    // Một đối tượng mà mỗi lần đổi sang chuỗi đều được đếm lại.
    static class DonHang {
        static int soLanToString = 0;

        @Override
        public String toString() {
            soLanToString++;
            return "DonHang[id=7, khach=Mai, tong=170000]";
        }
    }

    public static void main(String[] args) {
        // Giống máy chủ thật: chỉ ghi từ mức INFO trở lên, DEBUG bị tắt.
        ((ch.qos.logback.classic.Logger) log).setLevel(Level.INFO);
        DonHang don = new DonHang();

        log.debug("Đơn vừa tạo: " + don);
        System.out.println("Sau debug nối chuỗi: toString đã chạy " + DonHang.soLanToString + " lần");

        log.debug("Đơn vừa tạo: {}", don);
        System.out.println("Sau debug dùng {}  : toString đã chạy " + DonHang.soLanToString + " lần");

        try {
            Long.parseLong("abc");
        } catch (NumberFormatException e) {
            log.error("Cách 1, nối exception vào chuỗi: " + e);
            log.error("Cách 2, truyền exception làm tham số cuối, mã món {}", "abc", e);
        }
    }
}
