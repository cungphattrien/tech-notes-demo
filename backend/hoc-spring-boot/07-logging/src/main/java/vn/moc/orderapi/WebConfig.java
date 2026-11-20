package vn.moc.orderapi;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

// Đăng ký interceptor với Spring MVC. Không có bước này thì GhiRequestInterceptor chỉ là một bean nằm yên.
@Configuration
public class WebConfig implements WebMvcConfigurer {

    private final GhiRequestInterceptor ghiRequest;

    public WebConfig(GhiRequestInterceptor ghiRequest) {
        this.ghiRequest = ghiRequest;
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(ghiRequest).addPathPatterns("/menu/**", "/giam-gia");
    }
}
