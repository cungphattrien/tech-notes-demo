// Chạy bộ eval cho v1 với số lần khác nhau mỗi ca. Chạy: node do-on-dinh.ts
import { chayBoEval } from "./src/chay-eval.ts";

for (const soLan of [5, 20, 40]) {
  const baoCao = chayBoEval("v1", soLan);
  const loi = baoCao.ketQua.filter((kq) => kq.dat < kq.soLan);
  console.log(`${String(soLan).padStart(2)} lần mỗi ca: ${loi.length} ca lộ lỗi, ${String(baoCao.soLuotGoiMoHinh).padStart(3)} lượt gọi mô hình${loi.map((kq) => `  [${kq.ca.ten} ${kq.dat}/${kq.soLan}]`).join("")}`);
}
