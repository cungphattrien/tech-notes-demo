package vn.moc.donhang;

// Một dòng món của đơn. Mô tả và đơn giá được chép từ món lúc đặt, nên món đổi giá về sau không làm đổi dòng này.
// OrderLine không cần biết món là cà phê hay bánh: nó chỉ gọi moTa() và donGia().
public class OrderLine {
    private final long menuItemId;
    private final String itemName;
    private final int quantity;
    private final long unitPrice;

    public OrderLine(MenuItem item, int quantity) {
        if (quantity <= 0) {
            throw new IllegalArgumentException("Số lượng phải lớn hơn 0: " + quantity);
        }
        this.menuItemId = item.getId();
        this.itemName = item.moTa();      // mỗi loại món tự mô tả mình
        this.quantity = quantity;
        this.unitPrice = item.donGia();   // mỗi loại món tự tính giá của mình
    }

    public long thanhTien() {
        return quantity * unitPrice;
    }

    public long getMenuItemId() {
        return menuItemId;
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
}
