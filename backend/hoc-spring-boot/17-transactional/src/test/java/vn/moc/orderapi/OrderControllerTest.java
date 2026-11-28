package vn.moc.orderapi;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@AutoConfigureMockMvc
@Import(TestcontainersConfiguration.class)
@Transactional // mỗi test chạy trong một transaction và được rollback, nên dữ liệu mẫu luôn như cũ
class OrderControllerTest {

    @Autowired
    MockMvc mockMvc;

    @Test
    void timDonTheoTenKhachTheoTungTrang() throws Exception {
        // Dữ liệu mẫu: Lan có đơn 1 và 5, cộng 150 đơn sinh ra ở V2_1 (tổng 152)
        mockMvc.perform(get("/orders").param("khach", "Lan").param("size", "5").param("sort", "id,asc"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content.length()").value(5))
                .andExpect(jsonPath("$.content[0].id").value(1))
                .andExpect(jsonPath("$.content[1].id").value(5))
                .andExpect(jsonPath("$.page.totalElements").value(152))
                .andExpect(jsonPath("$.page.totalPages").value(31));
    }

    @Test
    void macDinhHaiMuoiDonMoiNhatTruoc() throws Exception {
        mockMvc.perform(get("/orders"))
                .andExpect(jsonPath("$.content.length()").value(20))
                .andExpect(jsonPath("$.content[0].id").value(1206))
                .andExpect(jsonPath("$.page.size").value(20));
    }

    @Test
    void coTrangKhongVuotQuaMotTram() throws Exception {
        mockMvc.perform(get("/orders").param("size", "100000"))
                .andExpect(jsonPath("$.content.length()").value(100))
                .andExpect(jsonPath("$.page.size").value(100));
    }

    @Test
    void datMonLayGiaHienTaiVaDonCuGiuGiaCu() throws Exception {
        // Trà đào (món 3) lên giá 49.000
        mockMvc.perform(put("/menu/3").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"Trà đào\",\"price\":49000}"))
                .andExpect(status().isOk());

        // Đơn mới dùng giá mới
        mockMvc.perform(post("/orders").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"customerName\":\"Mai\",\"lines\":[{\"menuItemId\":3,\"quantity\":2}]}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.lines[0].unitPrice").value(49000))
                .andExpect(jsonPath("$.total").value(98000));

        // Đơn cũ số 3 của Mai vẫn giữ giá lúc đặt
        mockMvc.perform(get("/orders/3"))
                .andExpect(jsonPath("$.lines[0].unitPrice").value(45000))
                .andExpect(jsonPath("$.total").value(170000));
    }
}
