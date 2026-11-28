package vn.moc.donhang.thunghiem;

// String bất biến: mọi method "sửa" chuỗi đều trả về chuỗi MỚI, chuỗi cũ giữ nguyên.
public class ThuStringBatBien {

    public static void main(String[] args) {
        String ten = "  lan ";
        ten.strip();                 // kết quả bị bỏ đi
        ten.toUpperCase();           // kết quả bị bỏ đi
        System.out.println("Sau khi gọi mà không gán: [" + ten + "]");

        String daSua = ten.strip();
        System.out.println("Gán kết quả cho biến mới: [" + daSua + "], biến cũ vẫn là [" + ten + "]");

        String a = "Lan";
        String b = "Lan";
        String c = new String("Lan");
        String d = "  Lan ".strip();
        System.out.println("a == b: " + (a == b) + ", a == c: " + (a == c) + ", a == d: " + (a == d));
        System.out.println("a.equals(c): " + a.equals(c) + ", a.equals(d): " + a.equals(d));
    }
}
