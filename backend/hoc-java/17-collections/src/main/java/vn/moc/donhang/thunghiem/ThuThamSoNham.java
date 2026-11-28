package vn.moc.donhang.thunghiem;

import vn.moc.donhang.Order;

// Cùng một lỗi nhớ nhầm thứ tự: với constructor nhiều tham số và với Builder.
public class ThuThamSoNham {

    public static void main(String[] args) {
        // Người viết nhớ nhầm: số điện thoại trước, địa chỉ sau.
        DonGiaoNhieuThamSo don = new DonGiaoNhieuThamSo("Hùng", "0901234567", "12 Lý Thường Kiệt, Quận 10", "Ít đá");
        System.out.println(don.phieuGiao());

        System.out.println("---- Cùng lỗi đó với Builder ----");
        Order.choKhach("Hùng")
                .diaChiGiao("0901234567")
                .soDienThoai("12 Lý Thường Kiệt, Quận 10")
                .tao();
    }
}
