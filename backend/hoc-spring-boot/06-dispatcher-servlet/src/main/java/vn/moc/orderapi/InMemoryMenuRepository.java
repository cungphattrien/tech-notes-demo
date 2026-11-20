package vn.moc.orderapi;

import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Repository;

@Repository
public class InMemoryMenuRepository implements MenuRepository {

    private final List<MenuItem> items = List.of(
            new MenuItem(1, "Cà phê sữa", 35000),
            new MenuItem(2, "Bạc xỉu", 39000),
            new MenuItem(3, "Trà đào", 45000),
            new MenuItem(4, "Bánh mì que", 15000),
            new MenuItem(5, "Cà phê đen", 29000));

    @Override
    public List<MenuItem> findAll() {
        return items;
    }

    @Override
    public Optional<MenuItem> findById(long id) {
        return items.stream().filter(item -> item.id() == id).findFirst();
    }
}
