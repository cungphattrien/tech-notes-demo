package vn.moc.donhang;

import java.util.ArrayList;
import java.util.List;

// Một đơn hàng: tên khách và các dòng món. Mọi thay đổi đều đi qua method của class này.
public class Order {
    private final String customerName;
    private final List<OrderLine> lines = new ArrayList<>();

    public Order(String customerName) {
        if (customerName == null || customerName.isBlank()) {
            throw new IllegalArgumentException("Tên khách không được trống");
        }
        this.customerName = customerName;
    }

    public void themMon(MenuItem item, int quantity) {
        lines.add(new OrderLine(item, quantity));
    }

    public String getCustomerName() {
        return customerName;
    }

    // Trả về bản chỉ đọc: bên ngoài xem được các dòng nhưng không thêm, xóa được.
    public List<OrderLine> getLines() {
        return List.copyOf(lines);
    }

    public long tongTien() {
        long tong = 0;
        for (OrderLine dong : lines) {
            tong += dong.thanhTien();
        }
        return tong;
    }

    public long giamGia() {
        return TinhDon.tinhGiamGia(tongTien());
    }

    public long phaiTra() {
        return tongTien() - giamGia();
    }
}
