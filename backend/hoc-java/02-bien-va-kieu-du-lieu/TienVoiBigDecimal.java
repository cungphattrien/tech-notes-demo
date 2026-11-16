import java.math.BigDecimal;
import java.math.RoundingMode;

public class TienVoiBigDecimal {
    public static void main(String[] args) {
        BigDecimal a = new BigDecimal("0.1");
        BigDecimal b = new BigDecimal("0.2");
        System.out.println("BigDecimal(\"0.1\") + BigDecimal(\"0.2\") = " + a.add(b));
        System.out.println("new BigDecimal(0.1) = " + new BigDecimal(0.1));

        BigDecimal giaDon = new BigDecimal("99999");
        BigDecimal giamGia = giaDon.multiply(new BigDecimal("0.10"));
        System.out.println("Giảm 10% của 99999 = " + giamGia);
        System.out.println("Làm tròn về đồng   = " + giamGia.setScale(0, RoundingMode.HALF_UP));
    }
}
