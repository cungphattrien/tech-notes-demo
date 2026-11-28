package vn.moc.donhang.thunghiem;

import java.util.HashMap;
import java.util.Map;

// Một HashMap mã món -> giá, nhìn từ bên trong: hashCode của khóa, bucket nó rơi vào, và mảng lớn dần.
// Chạy: java --add-opens java.base/java.util=ALL-UNNAMED ... vn.moc.donhang.thunghiem.ThuBenTrongHashMap
public class ThuBenTrongHashMap {

    // Đúng công thức của java.util.HashMap: trộn 16 bit cao xuống 16 bit thấp, rồi lấy vị trí bằng & (n - 1).
    static int bucketCua(Object khoa, int soBucket) {
        int h = khoa.hashCode();
        int tron = h ^ (h >>> 16);
        return tron & (soBucket - 1);
    }

    public static void main(String[] args) {
        HashMap<String, Long> gia = new HashMap<>();
        System.out.println("Mới tạo: " + NhinVaoHashMap.soBucket(gia) + " bucket");

        Map<String, Long> thucDon = Map.of("ca-phe-sua", 35_000L, "bac-xiu", 39_000L, "tra-dao", 45_000L,
                "banh-mi-que", 15_000L, "ca-phe-den", 29_000L);
        for (String ma : new String[] {"ca-phe-sua", "bac-xiu", "tra-dao", "banh-mi-que", "ca-phe-den"}) {
            gia.put(ma, thucDon.get(ma));
            System.out.printf("put %-12s hashCode = %11d -> bucket %2d (tự tính)%n",
                    ma, ma.hashCode(), bucketCua(ma, NhinVaoHashMap.soBucket(gia)));
        }
        System.out.println("Sau 5 món: " + NhinVaoHashMap.soBucket(gia) + " bucket");
        NhinVaoHashMap.cacBucket(gia).forEach(b -> System.out.println("  " + b));

        // Thêm các mã giả "mon-6", "mon-7"... và in mỗi lần mảng bucket lớn lên.
        int truoc = NhinVaoHashMap.soBucket(gia);
        for (int i = 6; i <= 100; i++) {
            gia.put("mon-" + i, 10_000L);
            int sau = NhinVaoHashMap.soBucket(gia);
            if (sau != truoc) {
                System.out.printf("Phần tử thứ %3d: %3d -> %3d bucket (ngưỡng cũ %d = %d x 0,75)%n",
                        gia.size(), truoc, sau, truoc * 3 / 4, truoc);
                truoc = sau;
            }
        }
        System.out.println("tra-dao sau khi mảng lớn lên: bucket " + bucketCua("tra-dao", truoc)
                + ", giá vẫn là " + gia.get("tra-dao"));
    }
}
