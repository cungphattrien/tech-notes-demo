package vn.moc.orderapi.dto;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.LocalDateTime;
import org.junit.jupiter.api.Test;
import vn.moc.orderapi.MenuItem;
import vn.moc.orderapi.Order;

// Unit test thuần: DtoMapperImpl là class thường do MapStruct sinh, tạo bằng new được, không cần Spring hay database.
class DtoMapperTest {

    DtoMapper mapper = new DtoMapperImpl();

    @Test
    void dongMonGhepDungTenDonGiaVaThanhTien() {
        Order don = new Order("Mai", LocalDateTime.of(2026, 12, 2, 8, 0));
        don.themMon(new MenuItem("Trà đào", 45_000, null), 3);   // 3 ly trà đào, 45.000 một ly

        OrderResponse ketQua = mapper.toResponse(don);

        assertThat(ketQua.lines()).hasSize(1);
        assertThat(ketQua.lines().get(0).name()).isEqualTo("Trà đào");
        assertThat(ketQua.lines().get(0).unitPrice()).isEqualTo(45_000);
        assertThat(ketQua.lines().get(0).lineTotal()).isEqualTo(135_000);
        assertThat(ketQua.total()).isEqualTo(135_000);
    }
}
