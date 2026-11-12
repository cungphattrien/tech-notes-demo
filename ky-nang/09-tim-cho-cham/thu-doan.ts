// Giả thuyết đầu tiên: "chắc tại định dạng tiền và chuyển JSON". Đo riêng hai phần đó. Chạy: node thu-doan.ts
import { baoCaoTheoKhach } from "./src/bao-cao.ts";
import { taoDonHang } from "./src/tao-du-lieu.ts";

const baoCao = baoCaoTheoKhach(taoDonHang(50_000, 20_000));

let batDau = performance.now();
const tienDaDinhDang = baoCao.map((dong) => `${dong.tong.toLocaleString("vi-VN")}đ`);
console.log(`Định dạng tiền cho ${tienDaDinhDang.length} dòng: ${Math.round(performance.now() - batDau)} ms`);

batDau = performance.now();
const json = JSON.stringify(baoCao);
console.log(`JSON.stringify (${json.length} ký tự): ${Math.round(performance.now() - batDau)} ms`);
