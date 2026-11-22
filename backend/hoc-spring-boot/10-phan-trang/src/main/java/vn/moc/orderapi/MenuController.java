package vn.moc.orderapi;

import java.net.URI;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MenuController {

    // Dữ liệu client gửi lên khi thêm hoặc sửa món.
    public record MonGuiLen(String name, long price, String description) {
    }

    private final MenuService service;

    public MenuController(MenuService service) {
        this.service = service;
    }

    @GetMapping("/menu")
    public List<MenuItem> list() {
        return service.listAll();
    }

    @GetMapping("/menu/{id}")
    public ResponseEntity<MenuItem> get(@PathVariable long id) {
        return service.find(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/menu")
    public ResponseEntity<MenuItem> create(@RequestBody MonGuiLen mon) {
        MenuItem moi = service.create(mon.name(), mon.price(), mon.description());
        return ResponseEntity.created(URI.create("/menu/" + moi.getId())).body(moi);
    }

    @PutMapping("/menu/{id}")
    public ResponseEntity<MenuItem> update(@PathVariable long id, @RequestBody MonGuiLen mon) {
        return service.update(id, mon.name(), mon.price())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/menu/{id}")
    public ResponseEntity<Void> delete(@PathVariable long id) {
        if (service.delete(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
