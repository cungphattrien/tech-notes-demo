package vn.moc.orderapi;

import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.context.annotation.Bean;
import org.testcontainers.postgresql.PostgreSQLContainer;
import org.testcontainers.utility.MountableFile;

// Mỗi lần chạy test: bật một PostgreSQL 17 mới trong Docker, nạp đúng hai file trong db/ như compose.yaml,
// và @ServiceConnection tự đưa url, username, password của container vào ứng dụng.
@TestConfiguration(proxyBeanMethods = false)
class TestcontainersConfiguration {

    @Bean
    @ServiceConnection
    PostgreSQLContainer postgres() {
        return new PostgreSQLContainer("postgres:17")
                .withCopyFileToContainer(MountableFile.forHostPath("db/"), "/docker-entrypoint-initdb.d/");
    }
}
