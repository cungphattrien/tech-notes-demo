package vn.moc.orderapi;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.util.ArrayList;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.transaction.UnexpectedRollbackException;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronizationManager;

// Hai cái bẫy của @Transactional, mỗi cái một bean thử nghiệm chỉ có trong test.
@SpringBootTest
@Import({TestcontainersConfiguration.class, BayTransactionalTest.CacBeanThu.class})
class BayTransactionalTest {

    @TestConfiguration
    static class CacBeanThu {

        @Bean
        GoiCungClass goiCungClass() {
            return new GoiCungClass();
        }

        @Bean
        HuyRoiNuotLoi huyRoiNuotLoi(OrderRepository orders, NhatKyService nhatKy) {
            return new HuyRoiNuotLoi(orders, nhatKy);
        }
    }

    // Ghi lại tên transaction đang chạy ở mỗi bước.
    static class GoiCungClass {

        @Transactional
        public List<String> ngoai() {
            List<String> ten = new ArrayList<>();
            ten.add("ngoai: " + TransactionSynchronizationManager.getCurrentTransactionName());
            ten.add(trong());                       // this.trong(): không qua proxy
            return ten;
        }

        @Transactional(propagation = Propagation.REQUIRES_NEW)
        public String trong() {
            return "trong: " + TransactionSynchronizationManager.getCurrentTransactionName();
        }
    }

    // Hủy đơn rồi ghi nhật ký; ghi nhật ký lỗi thì "bỏ qua", vì không muốn nhật ký làm hỏng việc hủy.
    static class HuyRoiNuotLoi {

        private final OrderRepository orders;
        private final NhatKyService nhatKy;

        HuyRoiNuotLoi(OrderRepository orders, NhatKyService nhatKy) {
            this.orders = orders;
            this.nhatKy = nhatKy;
        }

        @Transactional
        public void huy(long orderId, String ghiChu, boolean docLap) {
            orders.findById(orderId).orElseThrow().huy();
            try {
                if (docLap) {
                    nhatKy.ghiDocLap(orderId, "HUY", ghiChu);    // REQUIRES_NEW
                } else {
                    nhatKy.ghi(orderId, "HUY", ghiChu);          // REQUIRED: tham gia transaction này
                }
            } catch (RuntimeException e) {
                System.out.println("===== da nuot loi: " + e.getClass().getSimpleName());
            }
        }
    }

    @Autowired
    GoiCungClass goiCungClass;

    @Autowired
    HuyRoiNuotLoi huyRoiNuotLoi;

    @Autowired
    OrderRepository orders;

    @Test
    void goiCungClassThiRequiresNewBiBoQua() {
        List<String> ten = goiCungClass.ngoai();
        System.out.println("===== goi ngoai(): " + ten);
        System.out.println("===== goi trong() tu ben ngoai: " + goiCungClass.trong());

        assertThat(ten.get(1)).endsWith("GoiCungClass.ngoai");     // vẫn là transaction của ngoai
        assertThat(goiCungClass.trong()).endsWith("GoiCungClass.trong");
    }

    @Test
    void nuotLoiCuaMethodRequiredThiCommitThanhRollback() {
        String quaDai = "x".repeat(250);                            // cột note chỉ chứa 200 ký tự

        assertThatThrownBy(() -> huyRoiNuotLoi.huy(1010, quaDai, false))
                .isInstanceOf(UnexpectedRollbackException.class)
                .hasMessageContaining("rollback-only")
                .satisfies(e -> System.out.println("===== " + e));
        assertThat(orders.findById(1010L).orElseThrow().getStatus()).isEqualTo(OrderStatus.NEW);
    }

    @Test
    void nuotLoiCuaMethodRequiresNewThiViecChinhVanXong() {
        huyRoiNuotLoi.huy(1014, "x".repeat(250), true);

        assertThat(orders.findById(1014L).orElseThrow().getStatus()).isEqualTo(OrderStatus.CANCELLED);
    }
}
