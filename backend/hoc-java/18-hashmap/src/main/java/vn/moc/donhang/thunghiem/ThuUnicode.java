package vn.moc.donhang.thunghiem;

import java.text.Normalizer;
import java.util.Set;
import vn.moc.donhang.GiamKhachQuen;
import vn.moc.donhang.Order;
import vn.moc.donhang.ThucDon;

// Cùng một chữ "Hùng" nhưng hai cách mã hóa Unicode:
// NFC (dựng sẵn): "ù" là MỘT ký tự. NFD (tổ hợp): "u" + dấu huyền là HAI ký tự.
// Bàn phím trên Windows thường gõ ra NFC; dữ liệu chép từ macOS hay một số ứng dụng có thể là NFD.
public class ThuUnicode {

    public static void main(String[] args) {
        String nfc = "Hùng";
        String nfd = Normalizer.normalize(nfc, Normalizer.Form.NFD);   // giả lập tên gõ từ máy khác

        System.out.println("In ra: " + nfc + " / " + nfd);
        System.out.println("length: " + nfc.length() + " / " + nfd.length());
        System.out.println("equals: " + nfc.equals(nfd));
        System.out.println("Ký tự thứ 2: " + maUnicode(nfc.charAt(1)) + " / " + maUnicode(nfd.charAt(1)) + " " + maUnicode(nfd.charAt(2)));

        GiamKhachQuen khachQuen = new GiamKhachQuen(Set.of("Hùng"), 5);
        for (String ten : new String[] {nfc, nfd}) {
            Order don = new Order(ten, khachQuen);
            don.themMon(ThucDon.cuaQuanMoc().goi("tra-dao"), 2);
            System.out.println("Khách quen giảm cho " + ten + " (" + ten.length() + " ký tự): " + don.giamGia());
        }
    }

    static String maUnicode(char c) {
        return String.format("U+%04X", (int) c);
    }
}
