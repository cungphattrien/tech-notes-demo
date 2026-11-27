package vn.moc.orderapi;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.context.annotation.Import;
import org.springframework.test.web.servlet.MockMvc;

// KHÔNG có @Transactional: nếu test chạy trong một transaction rồi rollback, câu DELETE chỉ nằm chờ
// trong Hibernate, không bao giờ tới PostgreSQL, nên khóa ngoại không chặn và API trả 204 thay vì 409.
@SpringBootTest
@AutoConfigureMockMvc
@Import(TestcontainersConfiguration.class)
class XoaMonTest {

    @Autowired
    MockMvc mockMvc;

    @Test
    void xoaMonDangCoTrongDonTra409() throws Exception {
        mockMvc.perform(delete("/menu/4"))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.detail").value("Món đang nằm trong đơn hàng, không xóa được"));
    }
}
