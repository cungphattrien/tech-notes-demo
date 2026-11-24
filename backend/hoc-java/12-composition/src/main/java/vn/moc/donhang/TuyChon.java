package vn.moc.donhang;

// Một tùy chọn khách chọn thêm cho đồ uống: cỡ ly, đá, nóng, topping. Chỉ là dữ liệu: tên và phụ thu.
public record TuyChon(String ten, long phuThu) {

    public static final TuyChon LY_LON = new TuyChon("ly lớn", 10_000);
    public static final TuyChon DA = new TuyChon("đá", 3_000);        // ly nhựa
    public static final TuyChon NONG = new TuyChon("nóng", 0);
    public static final TuyChon TRAN_CHAU = new TuyChon("trân châu", 8_000);
    public static final TuyChon THACH_DAO = new TuyChon("thạch đào", 6_000);

    public TuyChon {
        if (ten == null || ten.isBlank()) {
            throw new IllegalArgumentException("Tên tùy chọn không được trống");
        }
        if (phuThu < 0) {
            throw new IllegalArgumentException("Phụ thu không được âm: " + phuThu);
        }
    }
}
