package vn.moc.orderapi;

import java.util.Arrays;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Component;

// Chỉ để học: khi khởi động xong, in ra các bean thuộc package vn.moc mà Spring đang giữ.
@Component
public class InDanhSachBean implements ApplicationRunner {

    private final ApplicationContext context;

    public InDanhSachBean(ApplicationContext context) {
        this.context = context;
    }

    @Override
    public void run(ApplicationArguments args) {
        System.out.println("=== Bean của vn.moc mà Spring đang giữ ===");
        Arrays.stream(context.getBeanDefinitionNames())
                .filter(name -> context.getType(name) != null
                        && context.getType(name).getName().startsWith("vn.moc"))
                .sorted()
                .forEach(name -> System.out.println(name + " -> " + context.getType(name).getSimpleName()));
    }
}
