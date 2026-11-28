package vn.moc.donhang;

import java.text.Normalizer;
import java.util.Locale;

// Chuẩn hóa chuỗi người dùng gõ vào, trước khi lưu hay so sánh.
// Mọi method trả về chuỗi MỚI: String bất biến, chuỗi truyền vào không bao giờ bị đổi.
public final class ChuanHoa {

    private ChuanHoa() {
    }

    // Tên để lưu và in: Unicode dạng NFC, bỏ dấu cách hai đầu, gộp nhiều dấu cách ở giữa thành một.
    // Giữ nguyên chữ hoa, chữ thường mà khách gõ.
    public static String ten(String ten) {
        if (ten == null) {
            return null;
        }
        String nfc = Normalizer.normalize(ten, Normalizer.Form.NFC);
        return nfc.strip().replaceAll("\\s+", " ");
    }

    // Khóa để SO SÁNH tên: như ten(...) và thêm chữ thường. "  lan ", "Lan" và "LAN" cho cùng một khóa.
    // Locale.ROOT: kết quả không phụ thuộc ngôn ngữ của máy chạy chương trình.
    public static String khoaSoSanh(String ten) {
        return ten(ten).toLowerCase(Locale.ROOT);
    }

    // Số điện thoại Việt Nam: bỏ dấu cách, dấu chấm, gạch ngang, ngoặc; đổi +84 hoặc 84 ở đầu thành 0.
    // Sau đó phải còn đúng 10 chữ số bắt đầu bằng 0, nếu không thì báo lỗi kèm chuỗi gốc.
    public static String soDienThoai(String so) {
        String chiSo = so.replaceAll("[\\s.()-]", "");
        if (chiSo.startsWith("+84")) {
            chiSo = "0" + chiSo.substring(3);
        } else if (chiSo.startsWith("84") && chiSo.length() == 11) {
            chiSo = "0" + chiSo.substring(2);
        }
        if (!chiSo.matches("0\\d{9}")) {
            throw new IllegalArgumentException("Số điện thoại không hợp lệ: " + so);
        }
        return chiSo;
    }
}
