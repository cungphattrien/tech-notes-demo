package vn.moc.orderapi;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.hamcrest.Matchers;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

// PUT /orders/{id}/lines: thay toàn bộ dòng món. Không có @Transactional trên test: kiểm dữ liệu thật đã commit.
@SpringBootTest
@AutoConfigureMockMvc
@Import(TestcontainersConfiguration.class)
class ThayDongMonTest {

    @Autowired
    MockMvc mockMvc;

    long monDongDau(long orderId) throws Exception {
        String json = mockMvc.perform(get("/orders/" + orderId)).andReturn().getResponse().getContentAsString();
        return Long.parseLong(json.replaceAll(".*?\"lines\":\\[\\{\"id\":\\d+,\"menuItemId\":(\\d+).*", "$1"));
    }

    @Test
    void thayBangCungMonVoiSoLuongKhac() throws Exception {
        long mon = monDongDau(20);   // giữ lại đúng món đang có: trường hợp từng vấp ràng buộc UNIQUE

        mockMvc.perform(put("/orders/20/lines").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"lines\":[{\"menuItemId\":" + mon + ",\"quantity\":4}]}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.lines.length()").value(1))
                .andExpect(jsonPath("$.lines[0].quantity").value(4))
                .andExpect(jsonPath("$.lines[0].id").value(Matchers.greaterThan(0)));

        mockMvc.perform(get("/orders/20"))
                .andExpect(jsonPath("$.lines.length()").value(1))
                .andExpect(jsonPath("$.lines[0].quantity").value(4));
    }

    @Test
    void monKhongTonTaiThiRollbackGiuNguyenDon() throws Exception {
        String truoc = mockMvc.perform(get("/orders/21")).andReturn().getResponse().getContentAsString();

        mockMvc.perform(put("/orders/21/lines").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"lines\":[{\"menuItemId\":1,\"quantity\":1},{\"menuItemId\":999,\"quantity\":1}]}"))
                .andExpect(status().isUnprocessableContent());

        // Các DELETE đã chạy (flush) nhưng transaction rollback, nên đơn còn nguyên như trước.
        mockMvc.perform(get("/orders/21"))
                .andExpect(status().isOk())
                .andExpect(result -> org.assertj.core.api.Assertions
                        .assertThat(result.getResponse().getContentAsString()).isEqualTo(truoc));
    }
}
