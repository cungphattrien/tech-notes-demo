// Chạy: node kiem-tra.ts  (file này chưa nằm trong Git, đừng git add nó)
import { tinhPhiGiao } from "./src/phi-giao.ts";

const cacCa: [string, number, number, number][] = [
  ["giỏ trống", 0, 2, 0],
  ["120.000đ, 2 km", 120000, 2, 15000],
  ["120.000đ, 5,5 km (làm tròn lên 6 km, vượt 3 km: 3 x 5.000đ)", 120000, 5.5, 30000],
  ["180.000đ, 2 km (ngưỡng miễn phí mới là 200.000đ)", 180000, 2, 15000],
  ["250.000đ, 8 km", 250000, 8, 0],
];
for (const [ten, tien, km, mongDoi] of cacCa) {
  const ra = tinhPhiGiao(tien, km);
  console.log(`${ra === mongDoi ? "ĐÚNG" : "SAI "} ${ten}: ra ${ra}, mong đợi ${mongDoi}`);
}
