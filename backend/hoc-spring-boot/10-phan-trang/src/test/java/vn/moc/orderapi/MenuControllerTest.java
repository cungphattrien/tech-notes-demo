package vn.moc.orderapi;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.web.servlet.MockMvc;

// Gửi request giả qua đúng DispatcherServlet thật (không mở cổng mạng) và kiểm kết quả.
@SpringBootTest
@Import(TestcontainersConfiguration.class)
@AutoConfigureMockMvc
class MenuControllerTest {

    @Autowired
    MockMvc mockMvc;

    @Test
    void layMotMonTheoMa() throws Exception {
        mockMvc.perform(get("/menu/3"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Trà đào"))
                .andExpect(jsonPath("$.price").value(45000));
    }

    @Test
    void maMonKhongCoThi404() throws Exception {
        mockMvc.perform(get("/menu/99")).andExpect(status().isNotFound());
    }

    @Test
    void maMonKhongPhaiSoThi400() throws Exception {
        mockMvc.perform(get("/menu/abc")).andExpect(status().isBadRequest());
    }

    @Test
    void doiXmlThi406() throws Exception {
        mockMvc.perform(get("/menu/3").header("Accept", "application/xml"))
                .andExpect(status().isNotAcceptable());
    }
}
