import java.nio.charset.Charset;

public class KiemTraMaHoa {
    public static void main(String[] args) {
        System.out.println("file.encoding   = " + System.getProperty("file.encoding"));
        System.out.println("native.encoding = " + System.getProperty("native.encoding"));
        System.out.println("stdout.encoding = " + System.getProperty("stdout.encoding"));
        System.out.println("System.out dùng = " + System.out.charset());
        System.out.println("Mặc định        = " + Charset.defaultCharset());
    }
}
