package vn.moc.donhang.thunghiem;

import java.util.HashMap;

// Biết trước sẽ có khoảng 1.000 khóa: new HashMap<>(1000) và HashMap.newHashMap(1000) có giống nhau không?
// Chạy: java --add-opens java.base/java.util=ALL-UNNAMED ... vn.moc.donhang.thunghiem.ThuDungLuongBanDau
public class ThuDungLuongBanDau {

    static void dem(String ten, HashMap<Long, String> map) {
        int lanLon = 0;
        int truoc = -1;
        for (long ma = 1; ma <= 1_000; ma++) {
            map.put(ma, "đơn " + ma);
            int sau = NhinVaoHashMap.soBucket(map);
            if (truoc != -1 && sau != truoc) {
                lanLon++;
                System.out.printf("  %s: phần tử thứ %d làm mảng lớn từ %d lên %d bucket%n", ten, ma, truoc, sau);
            }
            truoc = sau;
        }
        System.out.printf("%s: %d lần lớn lên sau phần tử đầu, cuối cùng %d bucket%n", ten, lanLon, truoc);
    }

    public static void main(String[] args) {
        dem("new HashMap<>()", new HashMap<>());
        dem("new HashMap<>(1000)", new HashMap<>(1000));
        dem("HashMap.newHashMap(1000)", HashMap.newHashMap(1000));
    }
}
