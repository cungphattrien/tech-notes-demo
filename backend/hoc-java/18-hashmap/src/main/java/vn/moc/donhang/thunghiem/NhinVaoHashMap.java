package vn.moc.donhang.thunghiem;

import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

// CHỈ ĐỂ HỌC: đọc trường private của java.util.HashMap bằng reflection để thấy mảng bucket bên trong.
// Cần chạy với --add-opens java.base/java.util=ALL-UNNAMED. Đừng bao giờ làm vậy trong code thật:
// tên trường bên trong có thể đổi ở bản JDK sau.
final class NhinVaoHashMap {

    private NhinVaoHashMap() {
    }

    // Số bucket hiện tại (độ dài mảng table). 0 nếu map chưa từng được put (mảng được tạo lười).
    static int soBucket(HashMap<?, ?> map) {
        Object[] table = table(map);
        return table == null ? 0 : table.length;
    }

    // Mỗi bucket có phần tử: "vị trí: khóa1 -> khóa2 ..." (đi theo con trỏ next của từng node).
    static List<String> cacBucket(HashMap<?, ?> map) {
        Object[] table = table(map);
        List<String> ketQua = new ArrayList<>();
        if (table == null) {
            return ketQua;
        }
        for (int i = 0; i < table.length; i++) {
            StringBuilder sb = new StringBuilder();
            for (Object node = table[i]; node != null; node = doc(node, "next")) {
                sb.append(sb.isEmpty() ? "" : " -> ").append(doc(node, "key"));
            }
            if (!sb.isEmpty()) {
                ketQua.add(String.format("bucket %2d: %s", i, sb));
            }
        }
        return ketQua;
    }

    // Kiểu node ở một bucket: "Node" (danh sách liên kết) hay "TreeNode" (cây đỏ đen).
    static String kieuNode(HashMap<?, ?> map, int bucket) {
        Object node = table(map)[bucket];
        return node == null ? "trống" : node.getClass().getSimpleName();
    }

    private static Object[] table(HashMap<?, ?> map) {
        return (Object[]) doc(map, "table");
    }

    private static Object doc(Object o, String ten) {
        try {
            Class<?> c = o.getClass();
            while (c != null) {
                try {
                    Field f = c.getDeclaredField(ten);
                    f.setAccessible(true);
                    return f.get(o);
                } catch (NoSuchFieldException e) {
                    c = c.getSuperclass();
                }
            }
            throw new IllegalStateException("Không có trường " + ten);
        } catch (IllegalAccessException e) {
            throw new IllegalStateException(e);
        }
    }
}
