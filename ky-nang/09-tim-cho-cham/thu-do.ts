// Đo thời gian bản đầu của baoCaoTheoKhach với 50.000 đơn. Chạy: node thu-do.ts
import { baoCaoTheoKhach } from "./src/bao-cao.ts";
import { taoDonHang } from "./src/tao-du-lieu.ts";

const orders = taoDonHang(50_000, 20_000);
const batDau = performance.now();
const baoCao = baoCaoTheoKhach(orders);
console.log(`${orders.length} đơn → ${baoCao.length} dòng, mất ${Math.round(performance.now() - batDau)} ms`);
console.log("Đầu bảng:", JSON.stringify(baoCao[0]));
