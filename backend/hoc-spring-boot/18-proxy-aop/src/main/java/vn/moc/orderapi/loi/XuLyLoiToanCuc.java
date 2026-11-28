package vn.moc.orderapi.loi;

import java.util.List;
import java.util.Map;
import org.hibernate.exception.ConstraintViolationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.core.PropertyReferenceException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;
import vn.moc.orderapi.ThanhToanException;

// Một chỗ duy nhất đổi mọi exception thành ProblemDetail (RFC 9457, Content-Type application/problem+json).
// Kế thừa ResponseEntityExceptionHandler: các lỗi chuẩn của Spring MVC (JSON hỏng, sai kiểu tham số,
// đường dẫn không có...) đã được xử lý sẵn; ta chỉ ghi đè hoặc thêm những gì cần.
@RestControllerAdvice
public class XuLyLoiToanCuc extends ResponseEntityExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(XuLyLoiToanCuc.class);

    // Tên ràng buộc trong PostgreSQL -> câu báo lỗi cho client (xem V1__tao_bang.sql).
    private static final Map<String, String> RANG_BUOC = Map.of(
            "menu_items_name_key", "Tên món đã có trong thực đơn",
            "order_lines_menu_item_id_fkey", "Món đang nằm trong đơn hàng, không xóa được");

    public record LoiTruong(String field, String message) {
    }

    // 400: @Valid thất bại. Liệt kê từng trường sai, không lộ tên class nội bộ.
    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex,
            HttpHeaders headers, HttpStatusCode status, WebRequest request) {
        List<LoiTruong> loi = ex.getBindingResult().getFieldErrors().stream()
                .map(e -> new LoiTruong(e.getField(), e.getDefaultMessage()))
                .toList();
        ProblemDetail pd = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST,
                "Có " + loi.size() + " trường không hợp lệ");
        pd.setTitle("Dữ liệu không hợp lệ");
        pd.setProperty("errors", loi);
        return ResponseEntity.badRequest().body(themRequestId(pd));
    }

    @ExceptionHandler(KhongTimThayException.class)
    public ProblemDetail khongTimThay(KhongTimThayException ex) {
        ProblemDetail pd = ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, ex.getMessage());
        pd.setTitle("Không tìm thấy");
        return themRequestId(pd);
    }

    @ExceptionHandler(MonKhongTonTaiException.class)
    public ProblemDetail monKhongTonTai(MonKhongTonTaiException ex) {
        ProblemDetail pd = ProblemDetail.forStatusAndDetail(HttpStatus.UNPROCESSABLE_CONTENT, ex.getMessage());
        pd.setTitle("Món không tồn tại");
        pd.setProperty("menuItemId", ex.getMenuItemId());
        return themRequestId(pd);
    }

    @ExceptionHandler(KhongTheHuyException.class)
    public ProblemDetail khongTheHuy(KhongTheHuyException ex) {
        ProblemDetail pd = ProblemDetail.forStatusAndDetail(HttpStatus.CONFLICT, ex.getMessage());
        pd.setTitle("Không hủy được đơn");
        return themRequestId(pd);
    }

    // 502: lỗi nằm ở cổng thanh toán phía sau, không phải ở request của client.
    @ExceptionHandler(ThanhToanException.class)
    public ProblemDetail thanhToanLoi(ThanhToanException ex) {
        log.warn("Cổng thanh toán lỗi: {}", ex.getMessage());
        ProblemDetail pd = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_GATEWAY, ex.getMessage());
        pd.setTitle("Cổng thanh toán lỗi");
        return themRequestId(pd);
    }

    // ?sort=khongCo: client gửi tên trường không có trong entity.
    @ExceptionHandler(PropertyReferenceException.class)
    public ProblemDetail sapXepSai(PropertyReferenceException ex) {
        ProblemDetail pd = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST,
                "Không sắp xếp được theo trường '" + ex.getPropertyName() + "'");
        pd.setTitle("Tham số sort không hợp lệ");
        return themRequestId(pd);
    }

    // 409: database từ chối vì trùng UNIQUE hoặc vướng khóa ngoại.
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ProblemDetail xungDot(DataIntegrityViolationException ex) {
        String tenRangBuoc = ex.getCause() instanceof ConstraintViolationException c ? c.getConstraintName() : null;
        String detail = RANG_BUOC.getOrDefault(tenRangBuoc, "Dữ liệu xung đột với dữ liệu đã có");
        log.warn("Vi phạm ràng buộc {}: {}", tenRangBuoc, detail);
        ProblemDetail pd = ProblemDetail.forStatusAndDetail(HttpStatus.CONFLICT, detail);
        pd.setTitle("Xung đột dữ liệu");
        return themRequestId(pd);
    }

    // 500: mọi lỗi còn lại. Ghi đủ stack trace vào log, nhưng client chỉ nhận câu chung và mã request.
    @ExceptionHandler(Exception.class)
    public ProblemDetail loiKhongLuongTruoc(Exception ex) {
        log.error("Lỗi không lường trước", ex);
        ProblemDetail pd = ProblemDetail.forStatusAndDetail(HttpStatus.INTERNAL_SERVER_ERROR,
                "Máy chủ gặp lỗi. Hãy gửi mã requestId cho quán để được hỗ trợ.");
        pd.setTitle("Lỗi máy chủ");
        return themRequestId(pd);
    }

    // Các lỗi chuẩn của Spring MVC (JSON hỏng, sai kiểu tham số, đường dẫn không có...) đều đi qua đây:
    // thêm requestId cho chúng giống các lỗi ở trên. Câu báo tiếng Việt lấy từ messages.properties.
    // Gọi super TRƯỚC: với vài lỗi (như NoResourceFoundException), body truyền vào là null và
    // ProblemDetail chỉ được tạo bên trong super.
    @Override
    protected ResponseEntity<Object> handleExceptionInternal(Exception ex, Object body, HttpHeaders headers,
            HttpStatusCode statusCode, WebRequest request) {
        ResponseEntity<Object> ketQua = super.handleExceptionInternal(ex, body, headers, statusCode, request);
        if (ketQua != null && ketQua.getBody() instanceof ProblemDetail pd) {
            themRequestId(pd);
        }
        return ketQua;
    }

    // Mã request do ThoiGianFilter đặt vào MDC: client gửi lại mã này, ta tìm đúng dòng log.
    private ProblemDetail themRequestId(ProblemDetail pd) {
        String requestId = MDC.get("requestId");
        if (requestId != null) {
            pd.setProperty("requestId", requestId);
        }
        return pd;
    }
}
