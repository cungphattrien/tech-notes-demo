package vn.moc.orderapi;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class GiamGiaService {

    private static final Logger log = LoggerFactory.getLogger(GiamGiaService.class);

    private final MocProperties.GiamGia quyTac;

    public GiamGiaService(MocProperties properties) {
        this.quyTac = properties.giamGia();
    }

    // Đơn từ ngưỡng trở lên được giảm phanTram %; phần lẻ dưới 1 đồng bị cắt xuống.
    public long tinhGiamGia(long tongTien) {
        long giam = 0;
        if (tongTien >= quyTac.nguong()) {
            giam = tongTien * quyTac.phanTram() / 100;
        }
        log.debug("Tổng {} đồng, quy tắc giảm {}% từ {} đồng: giảm {}", tongTien, quyTac.phanTram(), quyTac.nguong(), giam);
        return giam;
    }

    public MocProperties.GiamGia quyTac() {
        return quyTac;
    }
}
