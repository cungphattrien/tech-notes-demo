package vn.moc.orderapi;

import org.springframework.stereotype.Service;

@Service
public class GiamGiaService {

    private final MocProperties.GiamGia quyTac;

    public GiamGiaService(MocProperties properties) {
        this.quyTac = properties.giamGia();
    }

    // Đơn từ ngưỡng trở lên được giảm phanTram %; phần lẻ dưới 1 đồng bị cắt xuống.
    public long tinhGiamGia(long tongTien) {
        if (tongTien >= quyTac.nguong()) {
            return tongTien * quyTac.phanTram() / 100;
        }
        return 0;
    }

    public MocProperties.GiamGia quyTac() {
        return quyTac;
    }
}
