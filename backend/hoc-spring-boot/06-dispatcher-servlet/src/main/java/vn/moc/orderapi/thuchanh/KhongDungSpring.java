package vn.moc.orderapi.thuchanh;

import java.util.List;
import java.util.Optional;
import vn.moc.orderapi.InMemoryMenuRepository;
import vn.moc.orderapi.MenuItem;
import vn.moc.orderapi.MenuRepository;
import vn.moc.orderapi.MenuService;

// Chạy không cần Spring: tự "new" và tự nối từng đối tượng, rồi thử thay kho dữ liệu giả.
public class KhongDungSpring {

    public static void main(String[] args) {
        // Cách tự nối: ta phải biết cần new cái gì, theo thứ tự nào.
        MenuService thatService = new MenuService(new InMemoryMenuRepository());
        System.out.println("Kho thật   : " + thatService.listAll().size() + " món");

        // Vì MenuService nhận MenuRepository qua constructor nên đưa kho giả vào được.
        MenuRepository khoGia = new MenuRepository() {
            public List<MenuItem> findAll() {
                return List.of(new MenuItem(99, "Món thử", 1000));
            }

            public Optional<MenuItem> findById(long id) {
                return Optional.empty();
            }
        };
        MenuService serviceGia = new MenuService(khoGia);
        System.out.println("Kho giả    : " + serviceGia.listAll());
    }
}
