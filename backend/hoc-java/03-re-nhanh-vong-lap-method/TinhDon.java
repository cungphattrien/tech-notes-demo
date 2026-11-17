public class TinhDon {
    // Quy tắc của quán: đơn từ 100.000 đồng trở lên được giảm 10%.
    static final long NGUONG_GIAM_GIA = 100_000;
    static final int PHAN_TRAM_GIAM = 10;

    // Cộng tiền của từng dòng món: số lượng nhân đơn giá.
    static long tinhTongTien(int[] soLuong, long[] donGia) {
        long tong = 0;
        for (int i = 0; i < soLuong.length; i++) {
            tong += soLuong[i] * donGia[i];
        }
        return tong;
    }

    // Số tiền được giảm. Phần lẻ dưới 1 đồng bị bỏ (cắt xuống), nghĩa là khách được giảm ít hơn một chút.
    static long tinhGiamGia(long tongTien) {
        if (tongTien >= NGUONG_GIAM_GIA) {
            return tongTien * PHAN_TRAM_GIAM / 100;
        }
        return 0;
    }

    // Hai method cùng tên, khác tham số (overload): phần trăm giảm do người gọi chọn.
    static long tinhGiamGia(long tongTien, int phanTram) {
        if (tongTien >= NGUONG_GIAM_GIA) {
            return tongTien * phanTram / 100;
        }
        return 0;
    }

    // Khách còn thiếu mấy món rẻ (giá giaMon) nữa thì được giảm giá?
    static int soMonConThieu(long tongTien, long giaMon) {
        int dem = 0;
        while (tongTien < NGUONG_GIAM_GIA) {
            tongTien += giaMon;
            dem++;
        }
        return dem;
    }

    // Đơn đã DONE hoặc CANCELLED thì không đổi trạng thái nữa.
    static boolean choPhepDoiTrangThai(String trangThaiHienTai) {
        return switch (trangThaiHienTai) {
            case "DONE", "CANCELLED" -> false;
            case "NEW", "PAID" -> true;
            default -> throw new IllegalArgumentException("Trạng thái lạ: " + trangThaiHienTai);
        };
    }

    public static void main(String[] args) {
        String[] khach = {"Lan", "Mai", "Bảo"};
        // Mỗi phần tử của soLuong và donGia là một dòng món; ba đơn dùng ba cặp mảng.
        int[][] soLuongCacDon = {{2, 1}, {3, 1}, {2, 2}};
        long[][] donGiaCacDon = {{35000, 15000}, {45000, 35000}, {35000, 15000}};

        for (int i = 0; i < khach.length; i++) {
            long tong = tinhTongTien(soLuongCacDon[i], donGiaCacDon[i]);
            long giam = tinhGiamGia(tong);
            System.out.println(khach[i] + ": tổng " + tong + ", giảm " + giam + ", trả " + (tong - giam));
        }

        System.out.println();
        System.out.println("Ranh giới của quy tắc giảm giá:");
        long[] thu = {99_999, 100_000, 100_001};
        for (long tong : thu) {
            System.out.println("  " + tong + " -> giảm " + tinhGiamGia(tong));
        }
        System.out.println("  Giảm 15% cho 200000 -> " + tinhGiamGia(200_000, 15));

        System.out.println();
        long tongCuaLan = tinhTongTien(soLuongCacDon[0], donGiaCacDon[0]);
        System.out.println("Lan đang có " + tongCuaLan + ", cần thêm " + soMonConThieu(tongCuaLan, 15_000)
                + " bánh mì que nữa để được giảm");

        System.out.println();
        for (String tt : new String[]{"NEW", "PAID", "DONE", "CANCELLED"}) {
            System.out.println("Đơn đang " + tt + " -> đổi được? " + choPhepDoiTrangThai(tt));
        }
    }
}
