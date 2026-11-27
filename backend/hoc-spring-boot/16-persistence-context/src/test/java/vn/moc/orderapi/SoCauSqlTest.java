package vn.moc.orderapi;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import jakarta.persistence.EntityManagerFactory;
import org.hibernate.SessionFactory;
import org.hibernate.stat.Statistics;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.context.annotation.Import;
import org.springframework.test.web.servlet.MockMvc;

// Chặn N+1 quay lại: đếm số câu SQL mà Hibernate gửi đi cho mỗi request.
// Ai đó xóa join fetch hay batch size, số câu SQL tăng theo số đơn và test này đỏ ngay.
@SpringBootTest(properties = "spring.jpa.properties.hibernate.generate_statistics=true")
@AutoConfigureMockMvc
@Import(TestcontainersConfiguration.class)
class SoCauSqlTest {

    @Autowired
    MockMvc mockMvc;

    @Autowired
    EntityManagerFactory emf;

    Statistics thongKe;

    @BeforeEach
    void datLaiThongKe() {
        thongKe = emf.unwrap(SessionFactory.class).getStatistics();
        thongKe.clear();
    }

    @Test
    void xemMotDonChiMotCauSql() throws Exception {
        mockMvc.perform(get("/orders/3"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.lines.length()").value(2));

        assertThat(thongKe.getPrepareStatementCount()).isEqualTo(1);
    }

    @Test
    void trangDonKhongTangTheoSoDon() throws Exception {
        mockMvc.perform(get("/orders?size=20")).andExpect(status().isOk());
        long trang20 = thongKe.getPrepareStatementCount();

        thongKe.clear();
        mockMvc.perform(get("/orders?size=100"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content.length()").value(100));
        long trang100 = thongKe.getPrepareStatementCount();

        // 1 câu lấy đơn, 1 câu đếm, dòng món theo lô 20 đơn, món theo lô 20 món
        assertThat(trang20).isEqualTo(4);
        assertThat(trang100).isLessThanOrEqualTo(8);
    }
}
