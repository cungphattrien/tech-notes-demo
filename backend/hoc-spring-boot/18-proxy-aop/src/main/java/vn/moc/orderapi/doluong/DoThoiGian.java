package vn.moc.orderapi.doluong;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

// Đánh dấu method cần đo thời gian chạy. Tự annotation không làm gì cả: DoThoiGianAspect đọc nó qua proxy.
// RUNTIME: annotation còn giữ lại lúc chạy, để Spring đọc được bằng reflection.
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface DoThoiGian {
}
