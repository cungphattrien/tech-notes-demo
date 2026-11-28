package vn.moc.donhang;

// Mọi thứ quán bán được và in được lên phiếu: món, voucher quà tặng, về sau là combo.
// Interface chỉ nói "làm được gì", không nói "là gì" và không giữ dữ liệu.
public interface CoTheBan {

    // Mã in trên phiếu, ví dụ "MON-3" hay "VOUCHER-100000".
    String ma();

    String moTa();

    long donGia();

    // Default method: có sẵn cách làm mặc định, class nào cần khác thì tự ghi đè.
    // Thêm method này vào interface không làm hỏng class nào đang cài đặt nó.
    default boolean duocGiamGia() {
        return true;
    }
}
