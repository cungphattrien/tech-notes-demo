package vn.moc.donhang.thunghiem;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

// Tra đơn theo mã: duyệt cả List để tìm, so với hỏi thẳng một HashMap.
// N đơn trong sổ, tra 10.000 mã ngẫu nhiên. List phải so từng phần tử, Map nhảy thẳng tới khóa.
public class DoTimDon {

    // Một đơn rút gọn: mã và tên khách. Đủ để đo, không cần dòng món.
    record Don(long ma, String khach) {
    }

    static Don timTrongList(List<Don> dons, long ma) {
        for (Don d : dons) {
            if (d.ma() == ma) {
                return d;
            }
        }
        return null;
    }

    public static void main(String[] args) {
        Random ngauNhien = new Random(42);   // seed cố định: lần nào chạy cũng tra cùng các mã
        for (int n : new int[] {1_000, 10_000, 100_000}) {
            List<Don> list = new ArrayList<>();
            Map<Long, Don> map = new HashMap<>();
            for (long ma = 1; ma <= n; ma++) {
                Don d = new Don(ma, "Khách " + ma);
                list.add(d);
                map.put(ma, d);
            }
            long[] canTim = new long[10_000];
            for (int i = 0; i < canTim.length; i++) {
                canTim[i] = 1 + ngauNhien.nextInt(n);
            }

            for (long ma : canTim) {         // chạy thử một lượt cho JIT biên dịch trước khi đo
                timTrongList(list, ma);
                map.get(ma);
            }

            long batDau = System.nanoTime();
            int thayList = 0;
            for (long ma : canTim) {
                if (timTrongList(list, ma) != null) {
                    thayList++;
                }
            }
            long msList = (System.nanoTime() - batDau) / 1_000_000;

            batDau = System.nanoTime();
            int thayMap = 0;
            for (long ma : canTim) {
                if (map.get(ma) != null) {
                    thayMap++;
                }
            }
            long usMap = (System.nanoTime() - batDau) / 1_000;

            System.out.printf("N = %,d đơn, tra 10.000 mã: List mất %,d ms (thấy %,d), HashMap mất %,d µs (thấy %,d)%n",
                    n, msList, thayList, usMap, thayMap);
        }
    }
}
