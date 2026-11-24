package vn.moc.donhang;

// Một dòng của đơn: một thứ bán được (món, voucher...) và số lượng.
// Mã, mô tả, đơn giá và cờ được giảm giá được chép lúc đặt, nên đổi giá về sau không làm đổi dòng này.
public class OrderLine {
    private final String ma;
    private final String itemName;
    private final int quantity;
    private final long unitPrice;
    private final boolean duocGiamGia;

    public OrderLine(CoTheBan hang, int quantity) {
        if (quantity <= 0) {
            throw new IllegalArgumentException("Số lượng phải lớn hơn 0: " + quantity);
        }
        this.ma = hang.ma();
        this.itemName = hang.moTa();
        this.quantity = quantity;
        this.unitPrice = hang.donGia();
        this.duocGiamGia = hang.duocGiamGia();
    }

    public long thanhTien() {
        return quantity * unitPrice;
    }

    public String getMa() {
        return ma;
    }

    public String getItemName() {
        return itemName;
    }

    public int getQuantity() {
        return quantity;
    }

    public long getUnitPrice() {
        return unitPrice;
    }

    public boolean isDuocGiamGia() {
        return duocGiamGia;
    }
}
