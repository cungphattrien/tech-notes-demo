package vn.moc.donhang.thunghiem;

import java.util.HashMap;
import java.util.Map;
import java.util.function.LongFunction;

// Cùng một khóa "mã đơn", ba cách viết hashCode. Put N khóa rồi get lại cả N, đo thời gian.
// Chạy: java --add-opens java.base/java.util=ALL-UNNAMED ... vn.moc.donhang.thunghiem.DoHashCodeTe
public class DoHashCodeTe {

    // Tốt: record tự sinh hashCode từ trường ma, các mã khác nhau rải đều ra các bucket.
    record MaTot(long ma) {
    }

    // Tệ: mọi khóa cùng hashCode 42, nên cùng một bucket. Không Comparable.
    static final class MaTe {
        final long ma;

        MaTe(long ma) {
            this.ma = ma;
        }

        @Override
        public boolean equals(Object o) {
            return o instanceof MaTe k && k.ma == ma;
        }

        @Override
        public int hashCode() {
            return 42;
        }
    }

    // Vẫn tệ như trên, nhưng Comparable: HashMap dùng compareTo để xếp các khóa trong cây của bucket.
    static final class MaTeComparable implements Comparable<MaTeComparable> {
        final long ma;

        MaTeComparable(long ma) {
            this.ma = ma;
        }

        @Override
        public boolean equals(Object o) {
            return o instanceof MaTeComparable k && k.ma == ma;
        }

        @Override
        public int hashCode() {
            return 42;
        }

        @Override
        public int compareTo(MaTeComparable khac) {
            return Long.compare(ma, khac.ma);
        }
    }

    static <K> long doMs(int n, LongFunction<K> taoKhoa, String ten) {
        HashMap<K, Long> map = new HashMap<>();
        long batDau = System.nanoTime();
        for (long i = 0; i < n; i++) {
            map.put(taoKhoa.apply(i), i);
        }
        long tong = 0;
        for (long i = 0; i < n; i++) {
            tong += map.get(taoKhoa.apply(i));
        }
        long ms = (System.nanoTime() - batDau) / 1_000_000;
        // Khóa mã 0: MaTot có hashCode 0 nên ở bucket 0; hai loại tệ có hashCode 42 nên ở bucket 42.
        int bucketKhoa0 = ten.equals("MaTot") ? 0 : 42 & (NhinVaoHashMap.soBucket(map) - 1);
        System.out.printf("%-15s N = %,6d: %,6d ms, %,6d bucket, bucket chứa khóa 0 là %s%n",
                ten, n, ms, NhinVaoHashMap.soBucket(map), NhinVaoHashMap.kieuNode(map, bucketKhoa0));
        return tong;
    }

    public static void main(String[] args) {
        for (int i = 0; i < 3; i++) {             // chạy thử cho JIT, không in
            chayIm(MaTot::new);
            chayIm(MaTe::new);
            chayIm(MaTeComparable::new);
        }
        for (int n : new int[] {5_000, 20_000}) {
            doMs(n, MaTot::new, "MaTot");
            doMs(n, MaTe::new, "MaTe");
            doMs(n, MaTeComparable::new, "MaTeComparable");
        }
    }

    static <K> void chayIm(LongFunction<K> taoKhoa) {
        Map<K, Long> map = new HashMap<>();
        for (long i = 0; i < 2_000; i++) {
            map.put(taoKhoa.apply(i), i);
            map.get(taoKhoa.apply(i));
        }
    }
}
