package vn.moc.donhang;

// Chương trình sẽ sập: đơn có mã món không có trong thực đơn.
public class InPhieuLoi {

    static final String[] TEN_MON = {"Cà phê sữa", "Bạc xỉu", null, "Bánh mì que"}; // chỉ số 2 chưa có tên

    static String dinhDangDong(int maMon, int soLuong) {
        String ten = TEN_MON[maMon];
        return soLuong + " x " + ten + " (" + ten.length() + " ký tự)";
    }

    static void inPhieu(int maDon, int[] dsMaMon, int[] dsSoLuong) {
        try {
            for (int i = 0; i < dsMaMon.length; i++) {
                System.out.println(dinhDangDong(dsMaMon[i], dsSoLuong[i]));
            }
        } catch (NullPointerException e) {
            throw new IllegalStateException("Không in được phiếu của đơn " + maDon, e);
        }
    }

    public static void main(String[] args) {
        inPhieu(7, new int[]{0, 2}, new int[]{2, 1});
    }
}
