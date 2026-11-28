package vn.moc.orderapi;

import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.context.annotation.Bean;
import org.springframework.test.context.DynamicPropertyRegistrar;
import org.testcontainers.postgresql.PostgreSQLContainer;

// Mỗi lần chạy test: bật một PostgreSQL 17 trống trong Docker; Flyway dựng bảng khi ứng dụng test khởi động.
// @ServiceConnection tự đưa url, username, password của container vào ứng dụng.
@TestConfiguration(proxyBeanMethods = false)
class TestcontainersConfiguration {

    @Bean
    @ServiceConnection
    PostgreSQLContainer postgres() {
        return new PostgreSQLContainer("postgres:17");
    }

    // Test cần dữ liệu mẫu (món 3 là Trà đào, Mai có đơn 3...), giống profile dev.
    @Bean
    DynamicPropertyRegistrar flywayCoDuLieuMau() {
        return registry -> registry.add("spring.flyway.locations",
                () -> "classpath:db/migration,classpath:db/du-lieu-mau");
    }
}
