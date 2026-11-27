package vn.moc.donhang;

// Một quy tắc giảm giá. Hợp đồng mà MỌI cách cài phải giữ (để Order thay quy tắc này bằng quy tắc khác vẫn đúng):
//   0 <= giam(don) <= don.tongDuocGiamGia()
// tức không giảm âm, và không giảm nhiều hơn phần được giảm của đơn (phải trả không bao giờ âm).
@FunctionalInterface
public interface QuyTacGiamGia {

    long giam(Order don);

    // Không giảm gì. Dùng cho test, hoặc khi quán tạm dừng khuyến mãi.
    QuyTacGiamGia KHONG_GIAM = don -> 0;
}
