package vn.moc.orderapi;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

// Sửa và xóa từng dòng món. KHÔNG có @Transactional (xem bài xử lý lỗi): ta muốn thấy dữ liệu thật đã đổi
// khi đọc lại bằng một request khác. Mỗi test dùng một đơn khác nhau của dữ liệu mẫu.
@SpringBootTest
@AutoConfigureMockMvc
@Import(TestcontainersConfiguration.class)
class DongMonTest {

    @Autowired
    MockMvc mockMvc;

    long idDongDau(long orderId) throws Exception {
        MvcResult kq = mockMvc.perform(get("/orders/" + orderId)).andReturn();
        String json = kq.getResponse().getContentAsString();
        return Long.parseLong(json.replaceAll(".*?\"lines\":\\[\\{\"id\":(\\d+).*", "$1"));
    }

    @Test
    void doiSoLuongMotDong() throws Exception {
        // Đơn 2 của Hùng: 1 bạc xỉu 39.000
        long lineId = idDongDau(2);

        mockMvc.perform(patch("/orders/2/lines/" + lineId).contentType(MediaType.APPLICATION_JSON)
                        .content("{\"quantity\":3}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.lines[0].quantity").value(3))
                .andExpect(jsonPath("$.total").value(117000));

        mockMvc.perform(get("/orders/2")).andExpect(jsonPath("$.total").value(117000));
    }

    @Test
    void xoaMotDongConLaiCacDongKhac() throws Exception {
        // Đơn 5 của Lan: 1 cà phê sữa 35.000 và 2 cà phê đen 29.000
        long lineId = idDongDau(5);

        mockMvc.perform(delete("/orders/5/lines/" + lineId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.lines.length()").value(1));

        mockMvc.perform(get("/orders/5"))
                .andExpect(jsonPath("$.lines.length()").value(1))
                .andExpect(jsonPath("$.lines[0].name").value("Cà phê đen"));
    }

    @Test
    void dongKhongThuocDonThi404() throws Exception {
        mockMvc.perform(delete("/orders/5/lines/999999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.detail").value("Không tìm thấy dòng món mã 999999"));
    }
}
