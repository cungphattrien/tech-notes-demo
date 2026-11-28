package vn.moc.orderapi;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.Arrays;
import org.junit.jupiter.api.Test;
import org.springframework.aop.support.AopUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import vn.moc.orderapi.dto.DtoMapper;

// Bean nào trong order-api là proxy, và proxy loại gì.
@SpringBootTest
@Import(TestcontainersConfiguration.class)
class ProxyTest {

    @Autowired
    OrderService orderService;

    @Autowired
    NhatKyService nhatKyService;

    @Autowired
    DtoMapper dtoMapper;

    @Autowired
    OrderRepository orderRepository;

    static String moTa(Object bean) {
        String loai = AopUtils.isCglibProxy(bean) ? "proxy CGLIB (lop con)"
                : AopUtils.isJdkDynamicProxy(bean) ? "proxy JDK (cai interface)" : "khong phai proxy";
        return bean.getClass().getName() + " | " + loai
                + " | lop cha: " + bean.getClass().getSuperclass().getSimpleName()
                + " | interface: " + Arrays.stream(bean.getClass().getInterfaces()).map(Class::getSimpleName).toList();
    }

    @Test
    void inLoaiProxyCuaCacBean() {
        System.out.println("===== orderService:    " + moTa(orderService));
        System.out.println("===== nhatKyService:   " + moTa(nhatKyService));
        System.out.println("===== dtoMapper:       " + moTa(dtoMapper));
        System.out.println("===== orderRepository: " + moTa(orderRepository));

        assertThat(AopUtils.isCglibProxy(orderService)).isTrue();         // có @Transactional và @DoThoiGian
        assertThat(AopUtils.getTargetClass(orderService)).isEqualTo(OrderService.class);
        assertThat(AopUtils.isAopProxy(dtoMapper)).isFalse();             // không có annotation nào cần proxy
        assertThat(AopUtils.isJdkDynamicProxy(orderRepository)).isTrue(); // repository chỉ là một interface
    }
}
