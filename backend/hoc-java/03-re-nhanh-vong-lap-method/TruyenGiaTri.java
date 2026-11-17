public class TruyenGiaTri {
    static void tangGia(long gia) {
        gia = gia + 5000;
        System.out.println("  trong method: gia = " + gia);
    }

    static void tangGiaMangDonGia(long[] gia) {
        gia[0] = gia[0] + 5000;
        System.out.println("  trong method: gia[0] = " + gia[0]);
    }

    public static void main(String[] args) {
        long giaCaPheSua = 35000;
        tangGia(giaCaPheSua);
        System.out.println("Sau khi gọi: giaCaPheSua = " + giaCaPheSua);

        long[] bangGia = {35000, 15000};
        tangGiaMangDonGia(bangGia);
        System.out.println("Sau khi gọi: bangGia[0] = " + bangGia[0]);
    }
}
