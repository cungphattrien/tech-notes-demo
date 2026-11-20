package vn.moc.orderapi;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

// Filter đứng TRƯỚC DispatcherServlet: thấy mọi request, kể cả request không tới controller nào.
@Component
public class ThoiGianFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain chain) throws ServletException, IOException {
        long batDau = System.nanoTime();
        System.out.println("[filter] vào  " + request.getMethod() + " " + request.getRequestURI());
        try {
            chain.doFilter(request, response); // chuyển tiếp: tới filter kế, rồi tới DispatcherServlet
        } finally {
            long ms = (System.nanoTime() - batDau) / 1_000_000;
            System.out.println("[filter] ra   " + response.getStatus() + " sau " + ms + " ms");
        }
    }
}
