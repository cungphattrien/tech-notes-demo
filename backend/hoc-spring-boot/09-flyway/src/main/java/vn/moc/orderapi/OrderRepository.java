package vn.moc.orderapi;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> {

    // Spring Data đọc tên method và tự sinh câu truy vấn: WHERE customer_name = ? ORDER BY id
    List<Order> findByCustomerNameOrderById(String customerName);
}
