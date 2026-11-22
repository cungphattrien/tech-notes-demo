package vn.moc.donhang.thunghiem;

// Cách làm đầu tiên: một class cho mọi món, phân biệt bằng chuỗi "loai" và một chuỗi if. Xem ThuMonTheoLoai.
public class MonTheoLoai {
    private final String name;
    private final long price;
    private final String loai;     // "banh", "do-uong", "do-uong-da"
    private final boolean lyLon;   // chỉ có nghĩa với đồ uống

    public MonTheoLoai(String name, long price, String loai, boolean lyLon) {
        this.name = name;
        this.price = price;
        this.loai = loai;
        this.lyLon = lyLon;
    }

    public long donGia() {
        long gia = price;
        if (loai.equals("do-uong") || loai.equals("do-uong-da")) {
            if (lyLon) {
                gia += 10_000;
            }
        }
        if (loai.equals("do-uong-da")) {
            gia += 3_000;
        }
        return gia;
    }

    public String moTa() {
        return name + " [" + loai + "]";
    }
}
