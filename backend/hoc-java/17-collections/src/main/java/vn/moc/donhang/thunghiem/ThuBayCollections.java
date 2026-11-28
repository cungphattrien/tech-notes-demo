package vn.moc.donhang.thunghiem;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

// Hai cái bẫy hay gặp: danh sách không sửa được, và remove(int) với remove(Object) trên List<Long>.
public class ThuBayCollections {

    public static void main(String[] args) {
        // 1. List.of và Arrays.asList trả về danh sách không thêm được phần tử.
        List<String> monCoDinh = List.of("ca-phe-sua", "tra-dao");
        try {
            monCoDinh.add("bac-xiu");
        } catch (UnsupportedOperationException e) {
            System.out.println("List.of(...).add: " + e);
        }
        List<String> tuMang = Arrays.asList("ca-phe-sua", "tra-dao");
        tuMang.set(0, "bac-xiu");                          // sửa tại chỗ thì được
        try {
            tuMang.add("banh-mi-que");                     // đổi kích thước thì không
        } catch (UnsupportedOperationException e) {
            System.out.println("Arrays.asList(...).add: " + e + ", sau set: " + tuMang);
        }
        List<String> suaDuoc = new ArrayList<>(monCoDinh); // muốn sửa thì chép sang ArrayList
        suaDuoc.add("bac-xiu");
        System.out.println("new ArrayList<>(List.of(...)).add: " + suaDuoc);

        // 2. Hàng chờ pha chế là danh sách mã đơn. Quầy pha xong đơn mã 2 và muốn bỏ nó khỏi hàng.
        List<Long> choPha = new ArrayList<>(List.of(5L, 2L, 7L, 9L));
        choPha.remove(2);                                  // 2 là int: bỏ phần tử ở VỊ TRÍ 2 (mã 7)
        System.out.println("remove(2):  " + choPha);
        choPha = new ArrayList<>(List.of(5L, 2L, 7L, 9L));
        choPha.remove(Long.valueOf(2));                    // bỏ phần tử CÓ GIÁ TRỊ 2
        System.out.println("remove(Long.valueOf(2)): " + choPha);
    }
}
