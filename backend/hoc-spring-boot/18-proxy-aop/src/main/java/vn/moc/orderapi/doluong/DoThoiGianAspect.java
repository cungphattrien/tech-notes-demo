package vn.moc.orderapi.doluong;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.transaction.support.TransactionSynchronizationManager;

// Aspect: đoạn code chạy "bao quanh" mọi method có @DoThoiGian, mà không phải sửa từng method.
// Spring thấy bean nào có method khớp thì tạo proxy cho bean đó; proxy gọi aroundDoThoiGian thay cho method thật.
// @Order(HIGHEST_PRECEDENCE): aspect này nằm NGOÀI proxy transaction (transaction có thứ tự thấp nhất),
// nên thời gian đo được tính cả lúc commit.
@Aspect
@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class DoThoiGianAspect {

    private static final Logger log = LoggerFactory.getLogger(DoThoiGianAspect.class);

    private final long nguongMs;

    public DoThoiGianAspect(@Value("${moc.do-thoi-gian.nguong-ms:500}") long nguongMs) {
        this.nguongMs = nguongMs;
    }

    @Around("@annotation(vn.moc.orderapi.doluong.DoThoiGian)")
    public Object aroundDoThoiGian(ProceedingJoinPoint diem) throws Throwable {
        String ten = diem.getSignature().getDeclaringType().getSimpleName() + "." + diem.getSignature().getName();
        boolean coTransaction = TransactionSynchronizationManager.isActualTransactionActive();
        long batDau = System.nanoTime();
        try {
            return diem.proceed();                 // gọi tiếp: proxy transaction (nếu có), rồi tới method thật
        } finally {
            long ms = (System.nanoTime() - batDau) / 1_000_000;
            if (ms >= nguongMs) {
                log.warn("Chậm: {} mất {} ms (ngưỡng {} ms)", ten, ms, nguongMs);
            } else {
                log.debug("{} mất {} ms, lúc vào aspect đã có transaction: {}", ten, ms, coTransaction);
            }
        }
    }
}
