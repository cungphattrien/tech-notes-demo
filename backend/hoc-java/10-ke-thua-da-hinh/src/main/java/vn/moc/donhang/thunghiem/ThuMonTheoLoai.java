package vn.moc.donhang.thunghiem;

// Ba món, một món bị gõ nhầm loại. Trình biên dịch không biết "do-uong da" là sai.
public class ThuMonTheoLoai {

    public static void main(String[] args) {
        MonTheoLoai[] mon = {
                new MonTheoLoai("Bánh mì que", 15_000, "banh", false),
                new MonTheoLoai("Trà đào", 45_000, "do-uong-da", true),
                new MonTheoLoai("Cà phê sữa", 35_000, "do-uong da", false), // gõ nhầm: thiếu dấu gạch
        };
        for (MonTheoLoai m : mon) {
            System.out.println(m.moTa() + " -> " + m.donGia());
        }
    }
}
