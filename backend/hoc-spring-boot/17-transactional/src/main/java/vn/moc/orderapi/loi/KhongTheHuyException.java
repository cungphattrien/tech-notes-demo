package vn.moc.orderapi.loi;

// Đơn đã xong hoặc đã hủy thì không hủy được nữa (backend/DOMAIN.md). Trả 409.
public class KhongTheHuyException extends RuntimeException {

    public KhongTheHuyException(long orderId, String status) {
        super("Đơn " + orderId + " đang ở trạng thái " + status + ", không hủy được");
    }
}
