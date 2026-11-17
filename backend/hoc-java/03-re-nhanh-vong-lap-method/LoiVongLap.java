public class LoiVongLap {
    public static void main(String[] args) {
        int[] soLuong = {2, 1};
        long[] gia = {35000, 15000};

        long tong = 0;
        for (int i = 0; i <= soLuong.length; i++) {
            tong += soLuong[i] * gia[i];
        }
        System.out.println("Tổng: " + tong);
    }
}
