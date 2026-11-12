// So sánh bản đầu và bản dùng Map: mỗi bản chạy 5 lần trên cùng dữ liệu, in thời gian trung vị (giá trị ở giữa).
// Kích thước nhỏ hơn bản cũ chạy nổi, để thấy thời gian tăng theo số đơn thế nào. Chạy: node do-nhieu-lan.ts
import { baoCaoTheoKhach } from "./src/bao-cao.ts";
import { baoCaoTheoKhachCu } from "./src/bao-cao-cu.ts";
import { taoDonHang } from "./src/tao-du-lieu.ts";

function trungVi(chay: () => unknown, soLan = 5): number {
  const thoiGian = Array.from({ length: soLan }, () => {
    const batDau = performance.now();
    chay();
    return performance.now() - batDau;
  }).sort((a, b) => a - b);
  return thoiGian[Math.floor(soLan / 2)];
}

for (const soDon of [5_000, 10_000, 25_000, 50_000]) {
  const orders = taoDonHang(soDon, Math.round(soDon * 0.4));
  const cu = trungVi(() => baoCaoTheoKhachCu(orders));
  const moi = trungVi(() => baoCaoTheoKhach(orders));
  console.log(`${String(soDon).padStart(6)} đơn: bản đầu ${String(Math.round(cu)).padStart(5)} ms, bản Map ${moi.toFixed(1).padStart(5)} ms`);
}
