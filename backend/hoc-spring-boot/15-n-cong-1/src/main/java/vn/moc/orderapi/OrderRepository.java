package vn.moc.orderapi;

import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface OrderRepository extends JpaRepository<Order, Long> {

    // Pageable mang số trang, cỡ trang và cách sắp xếp; Spring Data thêm ORDER BY, OFFSET, LIMIT
    // và chạy thêm một câu COUNT để biết tổng số đơn.
    Page<Order> findByCustomerName(String customerName, Pageable pageable);

    // Một đơn cùng mọi dòng món và món của từng dòng, trong MỘT câu SQL (join fetch).
    // Dùng khi biết chắc sẽ đọc hết các dòng: xem đơn, sửa hay xóa một dòng.
    @Query("""
            select o from Order o
            left join fetch o.lines l
            left join fetch l.menuItem
            where o.id = :id""")
    Optional<Order> timDayDu(@Param("id") long id);
}
