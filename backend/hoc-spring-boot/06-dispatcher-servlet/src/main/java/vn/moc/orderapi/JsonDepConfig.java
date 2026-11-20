package vn.moc.orderapi;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import tools.jackson.databind.SerializationFeature;
import tools.jackson.databind.json.JsonMapper;

// Chỉ bật khi chạy với profile "json-dep". Ta tự khai báo JsonMapper nên cấu hình tự động của Spring Boot lùi lại.
@Configuration
@Profile("json-dep")
public class JsonDepConfig {

    @Bean
    public JsonMapper jsonMapper() {
        return JsonMapper.builder()
                .enable(SerializationFeature.INDENT_OUTPUT)
                .build();
    }
}
