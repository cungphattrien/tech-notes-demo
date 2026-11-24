package vn.moc.orderapi;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> {

    // Pageable mang số trang, cỡ trang và cách sắp xếp; Spring Data thêm ORDER BY, OFFSET, LIMIT
    // và chạy thêm một câu COUNT để biết tổng số đơn.
    Page<Order> findByCustomerName(String customerName, Pageable pageable);
}
