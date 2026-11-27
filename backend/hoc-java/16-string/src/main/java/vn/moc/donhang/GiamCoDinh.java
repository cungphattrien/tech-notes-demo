package vn.moc.donhang;

// Phiếu giảm thẳng một số tiền, nhưng không bao giờ giảm quá phần được giảm của đơn: giữ đúng hợp đồng.
public class GiamCoDinh implements QuyTacGiamGia {

    private final long soTien;

    public GiamCoDinh(long soTien) {
        if (soTien <= 0) {
            throw new IllegalArgumentException("Số tiền giảm phải lớn hơn 0: " + soTien);
        }
        this.soTien = soTien;
    }

    @Override
    public long giam(Order don) {
        return Math.min(soTien, don.tongDuocGiamGia());
    }
}
