package vn.moc.orderapi;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

// Interceptor đứng BÊN TRONG DispatcherServlet: chỉ chạy khi đã tìm được handler, và biết đó là handler nào.
@Component
public class GhiRequestInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        System.out.println("[interceptor] preHandle       handler = " + handler);
        return true; // trả false thì DispatcherServlet dừng ở đây, controller không được gọi
    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler,
                           ModelAndView modelAndView) {
        System.out.println("[interceptor] postHandle      status = " + response.getStatus());
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler,
                                Exception ex) {
        System.out.println("[interceptor] afterCompletion status = " + response.getStatus() + ", lỗi = " + ex);
    }
}
