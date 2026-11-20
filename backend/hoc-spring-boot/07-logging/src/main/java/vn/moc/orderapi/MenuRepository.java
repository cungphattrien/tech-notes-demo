package vn.moc.orderapi;

import java.util.List;
import java.util.Optional;

// Nơi lấy dữ liệu thực đơn. Hiện lưu trong bộ nhớ; về sau sẽ đổi sang PostgreSQL.
public interface MenuRepository {
    List<MenuItem> findAll();

    Optional<MenuItem> findById(long id);
}
