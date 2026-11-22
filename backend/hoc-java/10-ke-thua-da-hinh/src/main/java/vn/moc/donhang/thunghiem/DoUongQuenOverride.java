package vn.moc.donhang.thunghiem;

import vn.moc.donhang.MenuItem;

// Lỗi gõ tên method khi ghi đè: "dongia" thay vì "donGia", và không có @Override nên trình biên dịch không báo gì.
public class DoUongQuenOverride extends MenuItem {

    public DoUongQuenOverride(long id, String name, long price) {
        super(id, name, price);
    }

    // Định cộng tiền ly nhựa, nhưng đây là một method MỚI tên "dongia", không phải ghi đè donGia().
    public long dongia() {
        return getPrice() + 3_000;
    }

    public static void main(String[] args) {
        MenuItem mon = new DoUongQuenOverride(3, "Trà đào", 45_000);
        System.out.println("donGia() = " + mon.donGia());
    }
}
