package vn.moc.orderapi.dto;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.Map;
import org.junit.jupiter.api.Test;
import vn.moc.orderapi.OrderLine;

// Unit test thuần: DtoMapperImpl là class thường do MapStruct sinh, tạo bằng new được, không cần Spring hay database.
class DtoMapperTest {

    DtoMapper mapper = new DtoMapperImpl();

    @Test
    void dongMonGhepDungDonGiaVaThanhTien() {
        OrderLine dong = new OrderLine(3, 3, 45_000);   // 3 ly trà đào, 45.000 một ly

        OrderLineResponse ketQua = mapper.toLine(dong, Map.of(3L, "Trà đào"));

        assertThat(ketQua.unitPrice()).isEqualTo(45_000);
        assertThat(ketQua.lineTotal()).isEqualTo(135_000);
        assertThat(ketQua.name()).isEqualTo("Trà đào");
    }
}
