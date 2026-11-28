package vn.moc.orderapi;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import org.junit.jupiter.api.Test;
import org.springframework.aop.support.AopUtils;
import org.springframework.beans.factory.config.BeanPostProcessor;
import org.springframework.boot.test.context.runner.ApplicationContextRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import vn.moc.orderapi.doluong.DoThoiGian;
import vn.moc.orderapi.doluong.DoThoiGianAspect;

// Vòng đời của một bean có aspect, trong một context nhỏ không cần database.
// Output dùng chữ không dấu vì console của Maven trên Windows làm vỡ chữ có dấu.
class VongDoiBeanTest {

    // Một phụ thuộc nhỏ để thấy lúc nào nó được inject.
    static class BangGia {
        long giaTraDao() {
            return 45_000;
        }
    }

    // Bean minh họa: in ra từng bước của vòng đời.
    static class BeanMinhHoa {

        private final BangGia bangGia;

        BeanMinhHoa(BangGia bangGia) {
            this.bangGia = bangGia;
            System.out.println("===== 1. constructor, bangGia da duoc inject: " + (bangGia != null));
        }

        @PostConstruct
        void sauKhiTao() {
            System.out.println("===== 3. @PostConstruct, this la " + getClass().getSimpleName());
        }

        @DoThoiGian
        public String chay() {
            return "this ben trong method: " + getClass().getSimpleName() + ", gia " + bangGia.giaTraDao();
        }

        @PreDestroy
        void truocKhiHuy() {
            System.out.println("===== 6. @PreDestroy");
        }
    }

    // Method final có @DoThoiGian: proxy CGLIB không ghi đè được method final.
    static class CoMethodFinal {

        private final BangGia bangGia;

        CoMethodFinal(BangGia bangGia) {
            this.bangGia = bangGia;
        }

        @DoThoiGian
        public final long giaTraDao() {
            return bangGia.giaTraDao();
        }
    }

    // Ghi lại bean trước và sau bước khởi tạo, như mọi BeanPostProcessor khác (kể cả cái tạo proxy).
    static class GhiVongDoi implements BeanPostProcessor {

        @Override
        public Object postProcessBeforeInitialization(Object bean, String beanName) {
            if (beanName.equals("beanMinhHoa")) {
                System.out.println("===== 2. truoc khoi tao (BeanPostProcessor): " + bean.getClass().getSimpleName());
            }
            return bean;
        }

        @Override
        public Object postProcessAfterInitialization(Object bean, String beanName) {
            if (beanName.equals("beanMinhHoa")) {
                System.out.println("===== 4. sau khoi tao (BeanPostProcessor): " + bean.getClass().getSimpleName());
            }
            return bean;
        }
    }

    @Configuration
    @EnableAspectJAutoProxy
    static class CauHinh {

        @Bean
        static GhiVongDoi ghiVongDoi() {
            return new GhiVongDoi();
        }

        @Bean
        DoThoiGianAspect doThoiGianAspect() {
            return new DoThoiGianAspect(500);
        }

        @Bean
        BangGia bangGia() {
            return new BangGia();
        }

        @Bean
        BeanMinhHoa beanMinhHoa(BangGia bangGia) {
            return new BeanMinhHoa(bangGia);
        }

        @Bean
        CoMethodFinal coMethodFinal(BangGia bangGia) {
            return new CoMethodFinal(bangGia);
        }
    }

    @Test
    void vongDoiVaLucProxyXuatHien() {
        new ApplicationContextRunner().withUserConfiguration(CauHinh.class).run(context -> {
            BeanMinhHoa bean = context.getBean(BeanMinhHoa.class);
            System.out.println("===== 5. bean nhan duoc: " + bean.getClass().getSimpleName()
                    + ", la proxy: " + AopUtils.isAopProxy(bean));
            System.out.println("===== 5. goi chay(): " + bean.chay());

            assertThat(AopUtils.isCglibProxy(bean)).isTrue();
            assertThat(bean.chay()).contains("BeanMinhHoa,");
        });
    }

    @Test
    void methodFinalChayTrenProxyNenTruongLaNull() {
        new ApplicationContextRunner().withUserConfiguration(CauHinh.class).run(context -> {
            CoMethodFinal bean = context.getBean(CoMethodFinal.class);
            System.out.println("===== final: bean nhan duoc la " + bean.getClass().getSimpleName());

            assertThatThrownBy(bean::giaTraDao)
                    .isInstanceOf(NullPointerException.class)
                    .satisfies(e -> System.out.println("===== final: " + e));
        });
    }
}
