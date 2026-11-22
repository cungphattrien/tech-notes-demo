package vn.moc.orderapi;

import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
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
import vn.moc.orderapi.dto.MenuItemResponse;
import vn.moc.orderapi.dto.MonRequest;

@RestController
public class MenuController {

    private final MenuService service;

    public MenuController(MenuService service) {
        this.service = service;
    }

    @GetMapping("/menu")
    public List<MenuItemResponse> list() {
        return service.listAll().stream().map(MenuItemResponse::from).toList();
    }

    @GetMapping("/menu/{id}")
    public ResponseEntity<MenuItemResponse> get(@PathVariable long id) {
        return service.find(id)
                .map(MenuItemResponse::from)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // @Valid: kiểm các ràng buộc trong MonRequest trước khi vào method; sai thì trả 400, không chạm database.
    @ApiResponse(responseCode = "201", description = "Đã thêm món")
    @PostMapping("/menu")
    public ResponseEntity<MenuItemResponse> create(@Valid @RequestBody MonRequest mon) {
        MenuItem moi = service.create(mon.name(), mon.price(), mon.description());
        return ResponseEntity.created(URI.create("/menu/" + moi.getId())).body(MenuItemResponse.from(moi));
    }

    @PutMapping("/menu/{id}")
    public ResponseEntity<MenuItemResponse> update(@PathVariable long id, @Valid @RequestBody MonRequest mon) {
        return service.update(id, mon.name(), mon.price())
                .map(MenuItemResponse::from)
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
