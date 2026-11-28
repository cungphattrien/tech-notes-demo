package vn.moc.orderapi;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.context.runner.ApplicationContextRunner;
import org.springframework.boot.test.system.CapturedOutput;
import org.springframework.boot.test.system.OutputCaptureExtension;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import vn.moc.orderapi.doluong.DoThoiGian;
import vn.moc.orderapi.doluong.DoThoiGianAspect;

// DoThoiGianAspect chỉ cảnh báo method có @DoThoiGian và chạy lâu hơn ngưỡng.
@ExtendWith(OutputCaptureExtension.class)
class DoThoiGianAspectTest {

    static class ViecCanDo {

        @DoThoiGian
        public void cham() throws InterruptedException {
            Thread.sleep(80);
        }

        @DoThoiGian
        public void nhanh() {
        }

        public void khongDanhDau() throws InterruptedException {
            Thread.sleep(80);
        }
    }

    @Configuration
    @EnableAspectJAutoProxy
    static class CauHinh {

        @Bean
        DoThoiGianAspect doThoiGianAspect() {
            return new DoThoiGianAspect(50);       // ngưỡng 50 ms cho test chạy nhanh
        }

        @Bean
        ViecCanDo viecCanDo() {
            return new ViecCanDo();
        }
    }

    @Test
    void chiCanhBaoMethodCoDanhDauVaCham(CapturedOutput output) {
        new ApplicationContextRunner().withUserConfiguration(CauHinh.class).run(context -> {
            ViecCanDo viec = context.getBean(ViecCanDo.class);
            viec.cham();
            viec.nhanh();
            viec.khongDanhDau();
        });

        assertThat(output).contains("ViecCanDo.cham mất");
        assertThat(output).doesNotContain("ViecCanDo.nhanh mất").doesNotContain("khongDanhDau");
    }
}
