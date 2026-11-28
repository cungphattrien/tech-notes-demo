package vn.moc.orderapi;

// Cổng thanh toán mà đơn trả trước đi qua. Thư viện của các cổng thật thường báo lỗi bằng checked exception
// (như IOException), nên interface này cũng vậy: người gọi buộc phải xử lý ThanhToanException.
public interface CongThanhToan {

    void hoanTien(long orderId, long soTien) throws ThanhToanException;
}
