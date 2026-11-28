package vn.moc.orderapi;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;

// Kiểm rằng Flyway đã chạy đủ các migration, đúng thứ tự, và cột mới của V2 có trong bảng.
@SpringBootTest
@Import(TestcontainersConfiguration.class)
class FlywayMigrationTest {

    @Autowired
    JdbcTemplate jdbc;

    @Test
    void daChayDuCacMigrationTheoThuTu() {
        List<String> versions = jdbc.queryForList(
                "select version from flyway_schema_history where success order by installed_rank", String.class);

        assertThat(versions).containsExactly("1", "1.1", "2", "2.1", "3", "4");
    }

    @Test
    void bangMenuItemsCoCotDescription() {
        Integer soCot = jdbc.queryForObject(
                "select count(*) from information_schema.columns where table_name = 'menu_items' and column_name = 'description'",
                Integer.class);

        assertThat(soCot).isEqualTo(1);
    }
}
