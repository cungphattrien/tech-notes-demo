// Điểm khởi động: đọc dữ liệu, dựng máy chủ, mở cổng. Không còn logic nào khác ở đây.
import { loadOrders } from "./order-file.ts";
import { createOrderServer } from "./order-server.ts";

const ORDERS_FILE = new URL("../data/orders.json", import.meta.url);
const port = Number(process.env.PORT ?? 3000);

export const server = createOrderServer(loadOrders(ORDERS_FILE));
server.listen(port, () => console.log(`Đơn hàng Mộc: http://localhost:${port}/don-hang`));
