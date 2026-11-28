package vn.moc.orderapi;

// Checked exception (kế thừa Exception, không phải RuntimeException): cổng thanh toán từ chối hoặc không phản hồi.
public class ThanhToanException extends Exception {

    public ThanhToanException(String message) {
        super(message);
    }
}
