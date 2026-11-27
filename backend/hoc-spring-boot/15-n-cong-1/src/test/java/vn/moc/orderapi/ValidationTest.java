package vn.moc.orderapi;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
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

// Dữ liệu sai phải bị chặn ở cửa vào (400), trước khi chạm tới database.
@SpringBootTest
@AutoConfigureMockMvc
@Import(TestcontainersConfiguration.class)
@Transactional
class ValidationTest {

    @Autowired
    MockMvc mockMvc;

    @Test
    void tenMonToanDauCachBiTuChoi() throws Exception {
        mockMvc.perform(post("/menu").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"   \",\"price\":1000}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void giaAmBiTuChoi() throws Exception {
        mockMvc.perform(post("/menu").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"Trà sen\",\"price\":-5000}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void donKhongTenKhachKhongDongMonBiTuChoiVaKhongDuocLuu() throws Exception {
        mockMvc.perform(post("/orders").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"customerName\":\"\",\"lines\":[]}"))
                .andExpect(status().isBadRequest());

        // Dữ liệu mẫu có 1.206 đơn; không có đơn nào được thêm
        mockMvc.perform(get("/orders").param("size", "1"))
                .andExpect(jsonPath("$.page.totalElements").value(1206));
    }

    @Test
    void soLuongBangKhongTrongMotDongBiTuChoi() throws Exception {
        mockMvc.perform(post("/orders").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"customerName\":\"Mai\",\"lines\":[{\"menuItemId\":3,\"quantity\":0}]}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void dongMonTraVeCoTenMonVaThanhTien() throws Exception {
        mockMvc.perform(get("/orders/3"))
                .andExpect(jsonPath("$.lines[0].name").value("Trà đào"))
                .andExpect(jsonPath("$.lines[0].lineTotal").value(135000))
                .andExpect(jsonPath("$.total").value(170000));
    }
}
