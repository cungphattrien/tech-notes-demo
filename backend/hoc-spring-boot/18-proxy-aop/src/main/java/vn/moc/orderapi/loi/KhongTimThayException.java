package vn.moc.orderapi.loi;

// Tìm theo id trên đường dẫn mà không có: GET /orders/99999, PUT /menu/99... Trả 404.
public class KhongTimThayException extends RuntimeException {

    public KhongTimThayException(String loai, long id) {
        super("Không tìm thấy " + loai + " mã " + id);
    }
}
