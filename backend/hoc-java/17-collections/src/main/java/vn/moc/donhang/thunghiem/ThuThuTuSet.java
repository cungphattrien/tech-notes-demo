package vn.moc.donhang.thunghiem;

import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.TreeSet;

// Ba loại Set với cùng dữ liệu: tên khách theo thứ tự tới quán trong một buổi sáng, có người tới hai lần.
// Cả ba đều bỏ phần tử trùng; chúng chỉ khác nhau ở thứ tự khi duyệt.
public class ThuThuTuSet {

    public static void main(String[] args) {
        List<String> theoThuTuToi = List.of("Mai", "Lan", "Hùng", "Bảo", "Lan", "Châu", "An", "Mai");

        Set<String> hash = new HashSet<>(theoThuTuToi);
        Set<String> linked = new LinkedHashSet<>(theoThuTuToi);
        Set<String> tree = new TreeSet<>(theoThuTuToi);

        System.out.println("List         : " + theoThuTuToi + " (" + theoThuTuToi.size() + " phần tử)");
        System.out.println("HashSet      : " + hash + " (" + hash.size() + ")");
        System.out.println("LinkedHashSet: " + linked + " (" + linked.size() + ")");
        System.out.println("TreeSet      : " + tree + " (" + tree.size() + ")");

        // TreeSet so chuỗi theo mã Unicode từng ký tự, không theo bảng chữ cái tiếng Việt: "Đức" đứng sau "Vy".
        System.out.println("TreeSet có Đức: " + new TreeSet<>(List.of("Vy", "Đức", "Bảo", "Dung")));
    }
}
