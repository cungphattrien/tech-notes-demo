package vn.moc.orderapi;

import static org.hamcrest.Matchers.contains;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;

// POST /orders/{id}/cancel. Không có @Transactional trên test: kiểm dữ liệu thật đã commit hay rollback.
// Đơn mẫu (V2_1): 1002 là NEW, 1003 và 1007 là PAID, 1004 là DONE.
@SpringBootTest
@AutoConfigureMockMvc
@Import(TestcontainersConfiguration.class)
class HuyDonTest {

    @Autowired
    MockMvc mockMvc;

    @Autowired
    CongThanhToanGiaLap congThanhToan;

    @AfterEach
    void tatLoi() {
        congThanhToan.setGiaLapLoi(false);
    }

    ResultActions huy(long orderId, String lyDo) throws Exception {
        return mockMvc.perform(post("/orders/" + orderId + "/cancel").contentType(MediaType.APPLICATION_JSON)
                .content("{\"lyDo\":\"" + lyDo + "\"}"));
    }

    @Test
    void donMoiHuyKhongCanHoanTien() throws Exception {
        huy(1002, "Khách đổi ý").andExpect(status().isOk()).andExpect(jsonPath("$.status").value("CANCELLED"));

        mockMvc.perform(get("/orders/1002/events"))
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].type").value("HUY"));
    }

    @Test
    void donDaTraThiHoanTienVaGhiHaiDong() throws Exception {
        huy(1003, "Hết trà đào").andExpect(status().isOk()).andExpect(jsonPath("$.status").value("CANCELLED"));

        mockMvc.perform(get("/orders/1003/events"))
                .andExpect(jsonPath("$[*].type").value(contains("HUY", "HOAN_TIEN")));
    }

    @Test
    void congLoiThiDonGiuNguyenVaConNhatKyLoi() throws Exception {
        congThanhToan.setGiaLapLoi(true);

        huy(1007, "Khách đổi ý").andExpect(status().isBadGateway());

        // rollbackFor: việc hủy và dòng "HUY" bị rollback. REQUIRES_NEW: dòng "HOAN_TIEN_LOI" vẫn còn.
        mockMvc.perform(get("/orders/1007")).andExpect(jsonPath("$.status").value("PAID"));
        mockMvc.perform(get("/orders/1007/events"))
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].type").value("HOAN_TIEN_LOI"));
    }

    @Test
    void donDaXongKhongHuyDuoc() throws Exception {
        huy(1004, "Thử hủy").andExpect(status().isConflict());

        mockMvc.perform(get("/orders/1004/events")).andExpect(jsonPath("$.length()").value(0));
    }

    @Test
    void lyDoQuaDaiBiChanTruoc() throws Exception {
        huy(1002, "x".repeat(201)).andExpect(status().isBadRequest());
    }
}
