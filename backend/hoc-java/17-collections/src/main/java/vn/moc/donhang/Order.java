package vn.moc.donhang;

import java.util.ArrayList;
import java.util.List;

// Một đơn hàng: tên khách, quy tắc giảm giá, thông tin giao hàng (nếu có) và các dòng món.
public class Order {
    private final String customerName;
    private final List<OrderLine> lines = new ArrayList<>();
    private final QuyTacGiamGia quyTac;
    private final String diaChiGiao;      // null: khách dùng tại quán
    private final String soDienThoai;     // null: khách dùng tại quán
    private final String ghiChu;          // null: không có ghi chú

    // Giữ constructor cũ: đơn không nói gì về khuyến mãi thì dùng quy tắc mặc định (từ 100.000 giảm 10%).
    public Order(String customerName) {
        this(customerName, GiamTheoNguong.MAC_DINH);
    }

    // Order phụ thuộc vào interface QuyTacGiamGia, không phụ thuộc vào một quy tắc cụ thể nào.
    public Order(String customerName, QuyTacGiamGia quyTac) {
        this(customerName, quyTac, null, null, null);
    }

    // private: đơn có giao hàng chỉ tạo được qua Builder, nơi kiểm tra các trường đi cùng nhau.
    private Order(String customerName, QuyTacGiamGia quyTac, String diaChiGiao, String soDienThoai, String ghiChu) {
        if (customerName == null || customerName.isBlank()) {
            throw new IllegalArgumentException("Tên khách không được trống");
        }
        this.customerName = ChuanHoa.ten(customerName);   // "  Lan  " được lưu thành "Lan"
        this.quyTac = quyTac;
        this.diaChiGiao = diaChiGiao;
        this.soDienThoai = soDienThoai;
        this.ghiChu = ghiChu;
    }

    // Điểm bắt đầu của Builder: chỉ tên khách là bắt buộc, mọi thứ khác gọi theo tên.
    public static Builder choKhach(String customerName) {
        return new Builder(customerName);
    }

    public static class Builder {
        private final String customerName;
        private QuyTacGiamGia quyTac = GiamTheoNguong.MAC_DINH;
        private String diaChiGiao;
        private String soDienThoai;
        private String ghiChu;

        private Builder(String customerName) {
            this.customerName = customerName;
        }

        public Builder quyTac(QuyTacGiamGia quyTac) {
            this.quyTac = quyTac;
            return this;              // trả về chính builder để gọi nối tiếp
        }

        public Builder diaChiGiao(String diaChiGiao) {
            this.diaChiGiao = ChuanHoa.ten(diaChiGiao);
            return this;
        }

        // Chuẩn hóa rồi kiểm ngay khi gán: "090 123 4567" và "+84 90 123 4567" đều thành "0901234567".
        public Builder soDienThoai(String soDienThoai) {
            this.soDienThoai = ChuanHoa.soDienThoai(soDienThoai);
            return this;
        }

        public Builder ghiChu(String ghiChu) {
            this.ghiChu = ghiChu;
            return this;
        }

        // Kiểm tra những quy tắc liên quan tới NHIỀU trường cùng lúc, rồi mới tạo Order.
        public Order tao() {
            if ((diaChiGiao == null) != (soDienThoai == null)) {
                throw new IllegalStateException("Đơn giao hàng cần cả địa chỉ và số điện thoại");
            }
            return new Order(customerName, quyTac, diaChiGiao, soDienThoai, ghiChu);
        }
    }

    // Nhận mọi thứ bán được: món, voucher... Order không cần biết đó là gì.
    public void themMon(CoTheBan hang, int quantity) {
        lines.add(new OrderLine(hang, quantity));
    }

    public String getCustomerName() {
        return customerName;
    }

    public boolean laDonGiao() {
        return diaChiGiao != null;
    }

    public String getDiaChiGiao() {
        return diaChiGiao;
    }

    public String getSoDienThoai() {
        return soDienThoai;
    }

    public String getGhiChu() {
        return ghiChu;
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
