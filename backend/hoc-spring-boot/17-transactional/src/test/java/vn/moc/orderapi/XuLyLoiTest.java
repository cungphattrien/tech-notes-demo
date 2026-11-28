package vn.moc.orderapi;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
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

// Mỗi loại lỗi có đúng mã HTTP và cùng một định dạng ProblemDetail (application/problem+json).
@SpringBootTest
@AutoConfigureMockMvc
@Import(TestcontainersConfiguration.class)
@Transactional
class XuLyLoiTest {

    @Autowired
    MockMvc mockMvc;

    @Test
    void duLieuSaiTra400KemDanhSachTruong() throws Exception {
        mockMvc.perform(post("/orders").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"customerName\":\"\",\"lines\":[]}"))
                .andExpect(status().isBadRequest())
                .andExpect(content().contentType(MediaType.APPLICATION_PROBLEM_JSON))
                .andExpect(jsonPath("$.title").value("Dữ liệu không hợp lệ"))
                .andExpect(jsonPath("$.errors.length()").value(2));
    }

    @Test
    void monKhongTonTaiTra422() throws Exception {
        mockMvc.perform(post("/orders").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"customerName\":\"Mai\",\"lines\":[{\"menuItemId\":99,\"quantity\":1}]}"))
                .andExpect(status().isUnprocessableContent())
                .andExpect(jsonPath("$.menuItemId").value(99));
    }

    @Test
    void donKhongCoTra404CoThanResponse() throws Exception {
        mockMvc.perform(get("/orders/99999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.detail").value("Không tìm thấy đơn mã 99999"));
    }

    @Test
    void sapXepTheoTruongKhongCoTra400() throws Exception {
        mockMvc.perform(get("/orders").param("sort", "khongCo"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.detail").value("Không sắp xếp được theo trường 'khongCo'"));
    }

    @Test
    void trungTenMonTra409() throws Exception {
        mockMvc.perform(post("/menu").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"Trà đào\",\"price\":45000}"))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.detail").value("Tên món đã có trong thực đơn"));
    }

    @Test
    void jsonHongTra400BangTiengViet() throws Exception {
        mockMvc.perform(post("/orders").contentType(MediaType.APPLICATION_JSON).content("{\"customerName\":"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.title").value("JSON không đọc được"));
    }

    @Test
    void moiLoiDeuCoRequestId() throws Exception {
        mockMvc.perform(get("/orders/99999"))
                .andExpect(jsonPath("$.requestId").exists());
    }
}
