package vn.moc.donhang;

// Cách kiểm tra "bằng tay": tự gọi method, tự so kết quả, tự in ra. Xem bài để biết vì sao chưa đủ.
public class KiemTraBangTay {

    public static void main(String[] args) {
        kiemTra("đơn đúng 100.000", TinhDon.tinhGiamGia(100_000), 10_000);
        kiemTra("đơn 99.999", TinhDon.tinhGiamGia(99_999), 0);
        kiemTra("đơn của Mai 170.000", TinhDon.tinhGiamGia(170_000), 17_000);
    }

    static void kiemTra(String ten, long thucTe, long mongDoi) {
        if (thucTe == mongDoi) {
            System.out.println("ĐÚNG  " + ten);
        } else {
            System.out.println("SAI   " + ten + ": mong đợi " + mongDoi + " nhưng ra " + thucTe);
        }
    }
}
