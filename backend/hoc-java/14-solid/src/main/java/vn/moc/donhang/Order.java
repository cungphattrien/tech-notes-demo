package vn.moc.donhang;

import java.util.ArrayList;
import java.util.List;

// Một đơn hàng: tên khách và các dòng món. Mọi thay đổi đều đi qua method của class này.
public class Order {
    private final String customerName;
    private final List<OrderLine> lines = new ArrayList<>();
    private final QuyTacGiamGia quyTac;

    // Giữ constructor cũ: đơn không nói gì về khuyến mãi thì dùng quy tắc mặc định (từ 100.000 giảm 10%).
    public Order(String customerName) {
        this(customerName, GiamTheoNguong.MAC_DINH);
    }

    // Order phụ thuộc vào interface QuyTacGiamGia, không phụ thuộc vào một quy tắc cụ thể nào.
    public Order(String customerName, QuyTacGiamGia quyTac) {
        if (customerName == null || customerName.isBlank()) {
            throw new IllegalArgumentException("Tên khách không được trống");
        }
        this.customerName = customerName;
        this.quyTac = quyTac;
    }

    // Nhận mọi thứ bán được: món, voucher... Order không cần biết đó là gì.
    public void themMon(CoTheBan hang, int quantity) {
        lines.add(new OrderLine(hang, quantity));
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

    // Tổng của các dòng được giảm giá (voucher không được tính).
    public long tongDuocGiamGia() {
        long tong = 0;
        for (OrderLine dong : lines) {
            if (dong.isDuocGiamGia()) {
                tong += dong.thanhTien();
            }
        }
        return tong;
    }

    public long giamGia() {
        return quyTac.giam(this);
    }

    public long phaiTra() {
        return tongTien() - giamGia();
    }
}
