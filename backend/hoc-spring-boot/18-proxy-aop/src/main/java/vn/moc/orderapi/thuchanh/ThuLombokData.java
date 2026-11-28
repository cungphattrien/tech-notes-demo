package vn.moc.orderapi.thuchanh;

import java.util.HashSet;
import java.util.Set;
import lombok.Data;

// Vì sao không đặt @Data lên entity: equals/hashCode do Lombok sinh dùng MỌI trường, kể cả id.
// Hibernate gán id lúc lưu, nên hashCode của object đổi sau khi lưu. Chạy riêng, không cần Spring.
public class ThuLombokData {

    // Giống MenuItem nếu được viết bằng @Data: có getter, setter, equals, hashCode, toString cho mọi trường.
    @Data
    static class MonData {
        private Long id;
        private String name;
        private long price;
    }

    public static void main(String[] args) {
        MonData traVai = new MonData();
        traVai.setName("Trà vải");
        traVai.setPrice(42_000);

        Set<MonData> monVuaThem = new HashSet<>();
        monVuaThem.add(traVai);
        System.out.println("Trước khi lưu: id=" + traVai.getId() + ", hashCode=" + traVai.hashCode()
                + ", contains=" + monVuaThem.contains(traVai));

        traVai.setId(6L);   // việc Hibernate làm khi INSERT xong và nhận id từ PostgreSQL
        System.out.println("Sau khi lưu  : id=" + traVai.getId() + ", hashCode=" + traVai.hashCode()
                + ", contains=" + monVuaThem.contains(traVai));
        System.out.println("Set vẫn có " + monVuaThem.size() + " phần tử: " + monVuaThem);

        traVai.setPrice(-5_000);   // @Data cũng sinh setter cho mọi trường: không còn ai chặn giá âm
        System.out.println("Sau setPrice(-5000): " + traVai);
    }
}
