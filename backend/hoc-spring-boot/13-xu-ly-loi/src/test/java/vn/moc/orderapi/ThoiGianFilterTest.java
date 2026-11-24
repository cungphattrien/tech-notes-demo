package vn.moc.orderapi;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.boot.test.system.CapturedOutput;
import org.springframework.boot.test.system.OutputCaptureExtension;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

// Kiểm rằng mỗi request có một dòng log, và mã request trong log trùng với header X-Request-Id.
@SpringBootTest
@Import(TestcontainersConfiguration.class)
@AutoConfigureMockMvc
@ExtendWith(OutputCaptureExtension.class)
class ThoiGianFilterTest {

    @Autowired
    MockMvc mockMvc;

    @Test
    void moiRequestCoMotDongLogKemMaRequest(CapturedOutput output) throws Exception {
        MvcResult ketQua = mockMvc.perform(get("/menu/3"))
                .andExpect(header().exists("X-Request-Id"))
                .andReturn();
        String requestId = ketQua.getResponse().getHeader("X-Request-Id");

        assertThat(output.getOut())
                .contains("[" + requestId + "]")
                .contains("GET /menu/3 -> 200");
    }
}
