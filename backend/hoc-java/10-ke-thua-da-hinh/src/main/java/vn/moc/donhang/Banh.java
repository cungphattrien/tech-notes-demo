package vn.moc.donhang;

// Bánh là một món không có gì đặc biệt về giá: không ghi đè donGia() hay moTa(), dùng nguyên của MenuItem.
public class Banh extends MenuItem {

    public Banh(long id, String name, long price) {
        super(id, name, price);
    }
}
