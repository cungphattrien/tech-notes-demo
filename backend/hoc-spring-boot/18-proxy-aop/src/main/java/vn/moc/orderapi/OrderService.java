package vn.moc.orderapi;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.moc.orderapi.doluong.DoThoiGian;
import vn.moc.orderapi.dto.DtoMapper;
import vn.moc.orderapi.dto.OrderResponse;
import vn.moc.orderapi.loi.KhongTimThayException;
import vn.moc.orderapi.loi.MonKhongTonTaiException;

@Service
public class OrderService {

    // Một dòng trong yêu cầu đặt món: món nào, bao nhiêu ly.
    public record DongDat(long menuItemId, int quantity) {
    }

    private final OrderRepository orders;
    private final MenuRepository menu;
    private final DtoMapper dto;
    private final NhatKyService nhatKy;
    private final CongThanhToan thanhToan;

    public OrderService(OrderRepository orders, MenuRepository menu, DtoMapper dto,
                        NhatKyService nhatKy, CongThanhToan thanhToan) {
        this.orders = orders;
        this.menu = menu;
        this.dto = dto;
        this.nhatKy = nhatKy;
        this.thanhToan = thanhToan;
    }

    // Đọc và chuyển sang DTO TRONG cùng một transaction: các quan hệ LAZY được tải ở đây,
    // trước khi transaction đóng. Controller chỉ nhận DTO, không đụng tới entity.
    @Transactional(readOnly = true)
    public OrderResponse xemDon(long id) {
        return dto.toResponse(timDon(id));
    }

    @Transactional(readOnly = true)
    public Page<OrderResponse> timDon(String customerName, Pageable pageable) {
        Page<Order> trang = customerName == null
                ? orders.findAll(pageable)
                : orders.findByCustomerName(customerName, pageable);
        return trang.map(dto::toResponse);
    }

    // Lấy giá hiện tại của từng món làm unitPrice, rồi lưu đơn cùng các dòng trong một transaction.
    @DoThoiGian
    @Transactional
    public OrderResponse datMon(String customerName, List<DongDat> dongs) {
        Order don = new Order(customerName, LocalDateTime.now());
        for (DongDat d : dongs) {
            MenuItem mon = menu.findById(d.menuItemId())
                    .orElseThrow(() -> new MonKhongTonTaiException(d.menuItemId()));
            don.themMon(mon, d.quantity());
        }
        return dto.toResponse(orders.save(don));
    }

    @Transactional
    public OrderResponse doiSoLuong(long orderId, long lineId, int quantity) {
        Order don = timDon(orderId);
        don.doiSoLuong(lineId, quantity);
        return dto.toResponse(don);
    }

    @Transactional
    public OrderResponse xoaDong(long orderId, long lineId) {
        Order don = timDon(orderId);
        don.xoaDong(lineId);
        return dto.toResponse(don);
    }

    // Thay toàn bộ dòng món của đơn (PUT). Hai lần flush có chủ ý, xem bài persistence context:
    // 1) sau khi bỏ dòng cũ: ép Hibernate chạy DELETE ngay, trước khi thêm dòng mới cùng món,
    //    vì khi flush, Hibernate chạy INSERT trước DELETE và sẽ vấp ràng buộc UNIQUE (order_id, menu_item_id).
    // 2) sau khi thêm dòng mới: để dòng mới có id trước khi dựng DTO trả về.
    @DoThoiGian
    @Transactional
    public OrderResponse thayDongMon(long orderId, List<DongDat> dongs) {
        Order don = timDon(orderId);
        don.xoaHetDong();
        orders.flush();
        for (DongDat d : dongs) {
            MenuItem mon = menu.findById(d.menuItemId())
                    .orElseThrow(() -> new MonKhongTonTaiException(d.menuItemId()));
            don.themMon(mon, d.quantity());
        }
        orders.flush();
        return dto.toResponse(don);
    }

    // Hủy đơn; đơn đã trả trước (PAID) thì hoàn tiền. Ba quyết định về transaction, xem bài @Transactional:
    // 1) rollbackFor: ThanhToanException là checked exception, mặc định Spring KHÔNG rollback với loại này.
    //    Thiếu nó, cổng lỗi trả 502 mà đơn vẫn bị hủy (đã commit).
    // 2) Nhật ký "HUY" và "HOAN_TIEN" ghi bằng REQUIRED: cùng sống, cùng chết với việc hủy.
    // 3) Nhật ký "HOAN_TIEN_LOI" ghi bằng REQUIRES_NEW để còn lại sau rollback. Method đó phải nằm ở
    //    bean KHÁC (NhatKyService): gọi một method cùng class thì không qua proxy, @Transactional bị bỏ qua.
    // Giới hạn: nếu hoàn tiền xong mà commit lỗi, tiền đã hoàn nhưng đơn chưa hủy. Transaction database
    // không bao được một lời gọi ra hệ thống ngoài; chặng microservices sẽ bàn cách xử lý (outbox, saga).
    @DoThoiGian
    @Transactional(rollbackFor = ThanhToanException.class)
    public OrderResponse huyDon(long orderId, String lyDo) throws ThanhToanException {
        Order don = timDon(orderId);
        boolean daTraTruoc = don.getStatus() == OrderStatus.PAID;
        don.huy();
        nhatKy.ghi(orderId, "HUY", lyDo);
        if (daTraTruoc) {
            try {
                thanhToan.hoanTien(orderId, don.getTotal());
            } catch (ThanhToanException e) {
                nhatKy.ghiDocLap(orderId, "HOAN_TIEN_LOI", e.getMessage());   // REQUIRES_NEW, ở bean khác
                throw e;
            }
            nhatKy.ghi(orderId, "HOAN_TIEN", don.getTotal() + " đồng");
        }
        return dto.toResponse(don);
    }

    private Order timDon(long id) {
        return orders.timDayDu(id).orElseThrow(() -> new KhongTimThayException("đơn", id));
    }
}
