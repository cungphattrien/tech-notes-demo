package vn.moc.orderapi;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

// Ghi handler nào xử lý request. Mức DEBUG: chỉ hiện khi bật DEBUG cho package vn.moc.orderapi.
@Component
public class GhiRequestInterceptor implements HandlerInterceptor {

    private static final Logger log = LoggerFactory.getLogger(GhiRequestInterceptor.class);

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        log.debug("handler = {}", handler);
        return true;
    }
}
