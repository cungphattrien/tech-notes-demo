package vn.moc.orderapi;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class GiamGiaController {

    public record KetQua(long tong, long giam, long phaiTra, long nguong, int phanTram) {
    }

    private final GiamGiaService service;

    public GiamGiaController(GiamGiaService service) {
        this.service = service;
    }

    @GetMapping("/giam-gia")
    public KetQua tinh(@RequestParam long tong) {
        long giam = service.tinhGiamGia(tong);
        return new KetQua(tong, giam, tong - giam, service.quyTac().nguong(), service.quyTac().phanTram());
    }
}
