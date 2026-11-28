package vn.moc.orderapi;

import static org.assertj.core.api.Assertions.assertThat;

import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import org.hibernate.SessionFactory;
import org.hibernate.stat.Statistics;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.support.TransactionTemplate;

// Persistence context nhìn từ bên trong: mỗi test in ra một mốc, và log SQL (bật ở dưới) cho thấy câu nào chạy lúc nào.
// TransactionTemplate mở transaction ngay trong test, nên ta thấy rõ ranh giới bắt đầu và kết thúc.
@SpringBootTest(properties = {
        "spring.jpa.properties.hibernate.generate_statistics=true",
        "logging.level.org.hibernate.SQL=DEBUG",
        "logging.level.org.hibernate.engine.internal.StatisticalLoggingSessionEventListener=OFF"})
@Import(TestcontainersConfiguration.class)
class PersistenceContextTest {

    @Autowired
    OrderRepository orders;

    @Autowired
    EntityManager em;

    @Autowired
    EntityManagerFactory emf;

    @Autowired
    PlatformTransactionManager txManager;

    TransactionTemplate tx;
    TransactionTemplate txChiDoc;
    Statistics thongKe;

    @BeforeEach
    void chuanBi() {
        tx = new TransactionTemplate(txManager);
        txChiDoc = new TransactionTemplate(txManager);
        txChiDoc.setReadOnly(true);
        thongKe = emf.unwrap(SessionFactory.class).getStatistics();
        thongKe.clear();
    }

    static void moc(String ten) {
        System.out.println("===== " + ten);
    }

    // Đọc số lượng thật trong bảng, ở một transaction mới (persistence context mới, không dùng lại object cũ).
    int soLuongTrongBang(long lineId) {
        return tx.execute(s -> em.find(OrderLine.class, lineId).getQuantity());
    }

    @Test
    void trongMotTransactionTimHaiLanChiMotCauSql() {
        moc("mot transaction, findById(3) hai lan");
        boolean cungObject = tx.execute(s -> orders.findById(3L).get() == orders.findById(3L).get());

        assertThat(cungObject).isTrue();
        assertThat(thongKe.getPrepareStatementCount()).isEqualTo(1);
    }

    @Test
    void haiTransactionThiHaiCauSqlVaHaiObject() {
        moc("khong co transaction bao ngoai, findById(3) hai lan");
        Order a = orders.findById(3L).get();     // mỗi lời gọi repository có transaction riêng
        Order b = orders.findById(3L).get();

        assertThat(a).isNotSameAs(b);
        assertThat(thongKe.getPrepareStatementCount()).isEqualTo(2);
    }

    @Test
    void doiTruongLaDuocGhiKhongCanSave() {
        moc("doi so luong, khong goi save");
        long lineId = tx.execute(s -> {
            Order don = orders.timDayDu(10L).get();
            OrderLine dong = don.getLines().get(0);
            don.doiSoLuong(dong.getId(), dong.getQuantity() + 1);
            moc("ra khoi lambda: transaction sap commit");
            return dong.getId();
        });

        assertThat(thongKe.getEntityUpdateCount()).isEqualTo(1);
        assertThat(soLuongTrongBang(lineId)).isGreaterThan(1);
    }

    @Test
    void ganLaiDungGiaTriCuThiKhongUpdate() {
        moc("gan lai dung gia tri cu");
        tx.executeWithoutResult(s -> {
            Order don = orders.timDayDu(11L).get();
            OrderLine dong = don.getLines().get(0);
            don.doiSoLuong(dong.getId(), dong.getQuantity());
        });

        assertThat(thongKe.getEntityUpdateCount()).isZero();
    }

    @Test
    void truyVanJpqlTuFlushThayDoiTruoc() {
        moc("doi so luong thanh 7 roi truy van JPQL");
        int doc = tx.execute(s -> {
            Order don = orders.timDayDu(12L).get();
            long lineId = don.getLines().get(0).getId();
            don.doiSoLuong(lineId, 7);
            moc("truoc createQuery");
            return em.createQuery("select l.quantity from OrderLine l where l.id = :id", Integer.class)
                    .setParameter("id", lineId)
                    .getSingleResult();
        });

        assertThat(doc).isEqualTo(7);    // câu select thấy giá trị mới: update đã chạy trước nó
        assertThat(thongKe.getFlushCount()).isGreaterThanOrEqualTo(1);
    }

    @Test
    void transactionChiDocBoQuaThayDoi() {
        moc("transaction readOnly, doi so luong thanh 9");
        long lineId = txChiDoc.execute(s -> {
            Order don = orders.timDayDu(13L).get();
            long id = don.getLines().get(0).getId();
            don.doiSoLuong(id, 9);
            return id;
        });

        assertThat(thongKe.getEntityUpdateCount()).isZero();
        assertThat(soLuongTrongBang(lineId)).isNotEqualTo(9);   // thay đổi mất lặng lẽ, không có lỗi nào
    }
}
