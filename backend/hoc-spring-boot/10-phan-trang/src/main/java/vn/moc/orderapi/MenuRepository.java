package vn.moc.orderapi;

import org.springframework.data.jpa.repository.JpaRepository;

// Chỉ khai báo interface: Spring Data JPA tự tạo class cài đặt khi ứng dụng chạy.
// findAll, findById, save, deleteById, existsById... đều có sẵn từ JpaRepository.
public interface MenuRepository extends JpaRepository<MenuItem, Long> {
}
