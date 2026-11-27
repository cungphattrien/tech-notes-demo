package vn.moc.donhang.thunghiem;

// Ghép N dòng của một báo cáo cuối ngày: dùng += trên String, và dùng StringBuilder.
// Mỗi lần += tạo một String MỚI và chép lại toàn bộ nội dung cũ, nên tổng công việc tăng theo N bình phương.
public class DoNoiChuoi {

    static String bangCong(int n) {
        String s = "";
        for (int i = 0; i < n; i++) {
            s += "Đơn " + i + ": 2 x Trà đào\n";
        }
        return s;
    }

    static String bangBuilder(int n) {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < n; i++) {
            sb.append("Đơn ").append(i).append(": 2 x Trà đào\n");
        }
        return sb.toString();
    }

    static long doMs(Runnable viec) {
        long batDau = System.nanoTime();
        viec.run();
        return (System.nanoTime() - batDau) / 1_000_000;
    }

    public static void main(String[] args) {
        bangCong(2_000);       // chạy thử một lần cho JIT biên dịch trước khi đo
        bangBuilder(2_000);
        for (int n : new int[] {10_000, 20_000, 40_000}) {
            long cong = doMs(() -> bangCong(n));
            long builder = doMs(() -> bangBuilder(n));
            System.out.printf("N = %,d dòng: += mất %,d ms, StringBuilder mất %,d ms, cùng kết quả: %b%n",
                    n, cong, builder, bangCong(n).equals(bangBuilder(n)));
        }
    }
}
