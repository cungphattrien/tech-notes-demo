package vn.moc.orderapi.loi;

// Yêu cầu đặt món nhắc tới một món không có. Request đúng hình thức nhưng không xử lý được: trả 422.
public class MonKhongTonTaiException extends RuntimeException {

    private final long menuItemId;

    public MonKhongTonTaiException(long menuItemId) {
        super("Không có món mã " + menuItemId + " trong thực đơn");
        this.menuItemId = menuItemId;
    }

    public long getMenuItemId() {
        return menuItemId;
    }
}
