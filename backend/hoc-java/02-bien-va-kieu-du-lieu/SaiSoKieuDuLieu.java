public class SaiSoKieuDuLieu {
    public static void main(String[] args) {
        // 1. int tràn số: cộng hai số hợp lệ ra số âm
        int doanhThuThang = 2_000_000_000;
        int doanhThuThemVao = 500_000_000;
        int tong = doanhThuThang + doanhThuThemVao;
        System.out.println("1. int: " + doanhThuThang + " + " + doanhThuThemVao + " = " + tong);

        long tongLong = (long) doanhThuThang + doanhThuThemVao;
        System.out.println("   long: " + tongLong);

        try {
            Math.addExact(doanhThuThang, doanhThuThemVao);
        } catch (ArithmeticException e) {
            System.out.println("   Math.addExact báo lỗi: " + e);
        }

        // 2. double và tiền: sai số nhỏ nhưng có thật
        System.out.println("2. 0.1 + 0.2 = " + (0.1 + 0.2));
        System.out.println("   0.1 + 0.2 == 0.3 ? " + (0.1 + 0.2 == 0.3));

        // Phụ thu 15% cho món 3000 đồng: đáng ra là 3450
        double phuThuDouble = 3000 * 1.15;
        System.out.println("   3000 * 1.15 = " + phuThuDouble + "  -> (long) = " + (long) phuThuDouble);
        long phuThuNguyen = 3000 * 115 / 100;
        System.out.println("   3000 * 115 / 100 (chỉ dùng số nguyên) = " + phuThuNguyen);

        // 3. chia hai số nguyên thì cắt phần lẻ
        long tongDon = 99999;
        System.out.println("3. 99999 / 10 = " + (tongDon / 10) + "   (không phải 9999.9)");
        System.out.println("   99999 / 10.0 = " + (tongDon / 10.0));

        // 4. ép kiểu từ số thực sang số nguyên cắt phần lẻ, không làm tròn
        double giaTri = 3.99;
        System.out.println("4. (int) 3.99 = " + (int) giaTri + "   Math.round(3.99) = " + Math.round(giaTri));
    }
}
