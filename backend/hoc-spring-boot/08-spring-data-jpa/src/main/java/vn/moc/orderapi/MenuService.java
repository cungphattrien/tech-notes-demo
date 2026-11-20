package vn.moc.orderapi;

import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class MenuService {

    private final MenuRepository repository;

    public MenuService(MenuRepository repository) {
        this.repository = repository;
    }

    public List<MenuItem> listAll() {
        return repository.findAll();
    }

    public Optional<MenuItem> find(long id) {
        return repository.findById(id);
    }

    public MenuItem create(String name, long price) {
        return repository.save(new MenuItem(name, price));
    }

    // Không gọi save: trong một transaction, Hibernate tự thấy đối tượng đã đổi và ghi xuống khi commit.
    @Transactional
    public Optional<MenuItem> update(long id, String name, long price) {
        Optional<MenuItem> mon = repository.findById(id);
        mon.ifPresent(m -> m.doiTenVaGia(name, price));
        return mon;
    }

    public boolean delete(long id) {
        if (!repository.existsById(id)) {
            return false;
        }
        repository.deleteById(id);
        return true;
    }
}
