package vn.moc.donhang.thunghiem;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

// Đếm combo bán chạy: khóa là danh sách món của một đơn. Danh sách đó vẫn sửa được sau khi đã làm khóa.
public class ThuKhoaBiDoi {

    public static void main(String[] args) {
        Map<List<String>, Integer> soLanTheoCombo = new HashMap<>();

        List<String> donCuaLan = new ArrayList<>(List.of("Trà đào", "Bánh mì que"));
        soLanTheoCombo.merge(donCuaLan, 1, Integer::sum);
        System.out.println("Sau đơn của Lan: " + soLanTheoCombo);

        // Lan gọi thêm một ly cà phê sữa; code thêm món vào ĐÚNG danh sách đang làm khóa trong map.
        donCuaLan.add("Cà phê sữa");
        List<String> comboBaMon = List.of("Trà đào", "Bánh mì que", "Cà phê sữa");
        System.out.println("Map in ra: " + soLanTheoCombo);
        System.out.println("get(comboBaMon) = " + soLanTheoCombo.get(comboBaMon)
                + ", containsKey(donCuaLan) = " + soLanTheoCombo.containsKey(donCuaLan));

        // Hùng gọi đúng combo ba món: map không tìm thấy khóa cũ nên tạo thêm một khóa "trùng".
        soLanTheoCombo.merge(comboBaMon, 1, Integer::sum);
        System.out.println("Sau đơn của Hùng: " + soLanTheoCombo + ", size = " + soLanTheoCombo.size());
    }
}
