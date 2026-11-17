package vn.moc.orderapi;

import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Service;

@Service
public class MenuService {

    private final MenuRepository repository;

    // Constructor injection: Spring thấy cần một MenuRepository và tự đưa vào.
    public MenuService(MenuRepository repository) {
        this.repository = repository;
    }

    public List<MenuItem> listAll() {
        return repository.findAll();
    }

    public Optional<MenuItem> find(long id) {
        return repository.findById(id);
    }
}
