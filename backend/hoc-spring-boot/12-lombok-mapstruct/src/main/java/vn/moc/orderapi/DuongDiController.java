package vn.moc.orderapi;

import java.util.Arrays;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

// Trả về ngăn xếp lời gọi lúc request tới được controller: ai đã gọi ai, từ Tomcat tới đây.
@RestController
public class DuongDiController {

    @GetMapping("/duong-di")
    public List<String> duongDi() {
        return Arrays.stream(Thread.currentThread().getStackTrace())
                .map(f -> tenNgan(f.getClassName()) + "." + f.getMethodName())
                .filter(s -> !s.startsWith("Thread.") && !s.contains("$$"))
                .toList()
                .reversed(); // đảo lại: lời gọi đầu tiên ở trên cùng
    }

    // "org.apache.catalina.core.StandardWrapperValve" -> "StandardWrapperValve"
    private static String tenNgan(String tenDayDu) {
        return tenDayDu.substring(tenDayDu.lastIndexOf('.') + 1);
    }
}
