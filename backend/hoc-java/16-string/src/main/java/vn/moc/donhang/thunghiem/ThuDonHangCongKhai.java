package vn.moc.donhang.thunghiem;

// Ba cách làm hỏng một DonHangCongKhai mà trình biên dịch không hề cản.
public class ThuDonHangCongKhai {

    public static void main(String[] args) {
        DonHangCongKhai don = new DonHangCongKhai();
        don.tenKhach = "Mai";
        don.tenMon.add("Trà đào");
        don.soLuong.add(3);
        don.donGia.add(45_000L);
        don.tenMon.add("Cà phê sữa");
        don.soLuong.add(1);
        don.donGia.add(35_000L);
        System.out.println("Ban đầu          : " + don.tongTien());

        // 1. Gõ nhầm số lượng âm: không ai chặn.
        don.soLuong.set(1, -1);
        System.out.println("Số lượng -1      : " + don.tongTien());
        don.soLuong.set(1, 1);

        // 2. Xóa món khỏi một danh sách mà quên hai danh sách kia: dữ liệu lệch nhau.
        don.tenMon.remove(0);
        System.out.println("Sau khi xóa tên  : " + don.tenMon + " -> " + don.tongTien());

        // 3. Một đơn mới: thêm tên món mà quên số lượng và đơn giá, chương trình sập khi tính tiền.
        DonHangCongKhai donMoi = new DonHangCongKhai();
        donMoi.tenMon.add("Bánh mì que");
        System.out.println("Thiếu số lượng   : " + donMoi.tongTien());
    }
}
