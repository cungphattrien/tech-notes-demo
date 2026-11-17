public class TinhDonThuCong {
    public static void main(String[] args) {
        // Đơn của Lan: 2 cà phê sữa (35000) + 1 bánh mì que (15000)
        long tong1 = 2 * 35000 + 1 * 15000;
        long giam1 = 0;
        if (tong1 > 100000) {
            giam1 = tong1 / 10;
        }
        System.out.println("Lan : tổng " + tong1 + ", giảm " + giam1 + ", trả " + (tong1 - giam1));

        // Đơn của Mai: 3 trà đào (45000) + 1 cà phê sữa (35000)
        long tong2 = 3 * 45000 + 1 * 35000;
        long giam2 = 0;
        if (tong2 > 100000) {
            giam2 = tong2 / 10;
        }
        System.out.println("Mai : tổng " + tong2 + ", giảm " + giam2 + ", trả " + (tong2 - giam2));

        // Đơn của Bảo: 2 cà phê sữa (35000) + 2 bánh mì que (15000)
        long tong3 = 2 * 35000 + 2 * 15000;
        long giam3 = 0;
        if (tong3 > 100000) {
            giam3 = tong3 / 10;
        }
        System.out.println("Bảo : tổng " + tong3 + ", giảm " + giam3 + ", trả " + (tong3 - giam3));
    }
}
