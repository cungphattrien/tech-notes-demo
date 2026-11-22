package vn.moc.orderapi;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

// Ghi một dòng log cho mỗi request, kèm mã request để gom các dòng log của cùng một request.
@Component
public class ThoiGianFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(ThoiGianFilter.class);

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain chain) throws ServletException, IOException {
        String requestId = UUID.randomUUID().toString().substring(0, 8);
        MDC.put("requestId", requestId);          // mọi dòng log trên luồng này sẽ mang mã này
        response.setHeader("X-Request-Id", requestId);
        long batDau = System.nanoTime();
        boolean coException = false;
        try {
            chain.doFilter(request, response);
        } catch (IOException | ServletException | RuntimeException e) {
            // Exception bay ra khỏi Spring trước khi Tomcat kịp đặt mã 500, nên response.getStatus() vẫn là 200.
            coException = true;
            throw e;
        } finally {
            long ms = (System.nanoTime() - batDau) / 1_000_000;
            int status = coException ? 500 : response.getStatus();
            log.info("{} {} -> {} sau {} ms", request.getMethod(), request.getRequestURI(), status, ms);
            MDC.remove("requestId");              // luồng sẽ được dùng lại cho request khác
        }
    }
}
