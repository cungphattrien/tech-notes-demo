import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * API đơn hàng nhỏ nhất có thể, chỉ dùng JDK (không framework), để nhìn tận mắt HTTP và REST.
 * Chạy: java -Dstdout.encoding=UTF-8 OrderServer.java
 */
public class OrderServer {

    // record: cách khai báo gọn một kiểu dữ liệu chỉ để chứa giá trị (bài về record sẽ nói kỹ)
    record Order(int id, String customer, String item, int quantity) {
        String toJson() {
            return "{\"id\":%d,\"customer\":\"%s\",\"item\":\"%s\",\"quantity\":%d}"
                    .formatted(id, customer, item, quantity);
        }
    }

    // Dữ liệu nằm trong bộ nhớ: tắt server là mất. Server mặc định xử lý từng request một, nên
    // danh sách thường là đủ cho demo (bài về đa luồng sẽ nói vì sao không đủ cho dự án thật).
    static final List<Order> orders = new ArrayList<>();
    static int nextId = 3;

    static final Pattern CUSTOMER = Pattern.compile("\"customer\"\\s*:\\s*\"([^\"]+)\"");
    static final Pattern ITEM = Pattern.compile("\"item\"\\s*:\\s*\"([^\"]+)\"");
    static final Pattern QUANTITY = Pattern.compile("\"quantity\"\\s*:\\s*(\\d+)");

    public static void main(String[] args) throws IOException {
        orders.add(new Order(1, "Lan", "Cà phê sữa", 2));
        orders.add(new Order(2, "Hùng", "Bạc xỉu", 1));

        HttpServer server = HttpServer.create(new InetSocketAddress(8080), 0);
        server.createContext("/orders", OrderServer::handleOrders);
        server.createContext("/getOrder", OrderServer::handleBadStyle);
        server.start();
        System.out.println("Server chạy tại http://localhost:8080");
    }

    // Kiểu đặt tên API KHÔNG nên làm: động từ trong đường dẫn, lỗi nhưng vẫn trả 200.
    static void handleBadStyle(HttpExchange ex) throws IOException {
        send(ex, 200, "{\"error\":\"không tìm thấy đơn\"}");
    }

    static void handleOrders(HttpExchange ex) throws IOException {
        String method = ex.getRequestMethod();
        String[] parts = ex.getRequestURI().getPath().split("/"); // "/orders/1" -> ["", "orders", "1"]

        if (parts.length == 2) {                       // /orders
            switch (method) {
                case "GET" -> send(ex, 200, listJson());
                case "POST" -> createOrder(ex);
                default -> methodNotAllowed(ex, "GET, POST");
            }
        } else if (parts.length == 3) {                // /orders/{id}
            int id;
            try {
                id = Integer.parseInt(parts[2]);
            } catch (NumberFormatException e) {
                send(ex, 400, "{\"error\":\"id phải là số\"}");
                return;
            }
            switch (method) {
                case "GET" -> getOrder(ex, id);
                case "DELETE" -> deleteOrder(ex, id);
                default -> methodNotAllowed(ex, "GET, DELETE");
            }
        } else {
            send(ex, 404, "{\"error\":\"không có đường dẫn này\"}");
        }
    }

    static String listJson() {
        return "[" + String.join(",", orders.stream().map(Order::toJson).toList()) + "]";
    }

    static void getOrder(HttpExchange ex, int id) throws IOException {
        for (Order o : orders) {
            if (o.id() == id) {
                send(ex, 200, o.toJson());
                return;
            }
        }
        send(ex, 404, "{\"error\":\"không tìm thấy đơn %d\"}".formatted(id));
    }

    static void createOrder(HttpExchange ex) throws IOException {
        String body = new String(ex.getRequestBody().readAllBytes(), StandardCharsets.UTF_8);
        Matcher customer = CUSTOMER.matcher(body);
        Matcher item = ITEM.matcher(body);
        Matcher quantity = QUANTITY.matcher(body);
        if (!customer.find() || !item.find() || !quantity.find() || Integer.parseInt(quantity.group(1)) < 1) {
            send(ex, 400, "{\"error\":\"cần customer, item và quantity (số nguyên từ 1)\"}");
            return;
        }
        Order order = new Order(nextId++, customer.group(1), item.group(1), Integer.parseInt(quantity.group(1)));
        orders.add(order);
        ex.getResponseHeaders().set("Location", "/orders/" + order.id());
        send(ex, 201, order.toJson());
    }

    static void deleteOrder(HttpExchange ex, int id) throws IOException {
        if (orders.removeIf(o -> o.id() == id)) {
            send(ex, 204, "");
        } else {
            send(ex, 404, "{\"error\":\"không tìm thấy đơn %d\"}".formatted(id));
        }
    }

    static void methodNotAllowed(HttpExchange ex, String allowed) throws IOException {
        ex.getResponseHeaders().set("Allow", allowed);
        send(ex, 405, "{\"error\":\"phương thức không được hỗ trợ\"}");
    }

    static void send(HttpExchange ex, int status, String json) throws IOException {
        ex.getResponseHeaders().set("Content-Type", "application/json; charset=utf-8");
        if (status == 204) {                           // 204 không có nội dung
            ex.sendResponseHeaders(204, -1);
            ex.close();
            return;
        }
        byte[] bytes = json.getBytes(StandardCharsets.UTF_8);
        ex.sendResponseHeaders(status, bytes.length);
        try (var out = ex.getResponseBody()) {
            out.write(bytes);
        }
    }
}
