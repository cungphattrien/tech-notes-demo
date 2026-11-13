// In kết quả bộ eval. Chạy: node chay.ts v1 v2
import type { PhienBan } from "./src/agent.ts";
import { chayBoEval, quaCong, tomTatNhom } from "./src/chay-eval.ts";

const SO_LAN = 5;
for (const phienBan of process.argv.slice(2) as PhienBan[]) {
  const baoCao = chayBoEval(phienBan, SO_LAN);
  console.log(`=== ${phienBan}: ${baoCao.ketQua.length} ca x ${SO_LAN} lần`);
  for (const kq of baoCao.ketQua) console.log(`${kq.ca.nhom.padEnd(14)} ${kq.ca.ten.padEnd(26)} ${kq.dat}/${kq.soLan}${kq.loi.length ? `   <- ${kq.loi.join("; ")}` : ""}`);
  console.log("--- theo nhóm");
  for (const n of tomTatNhom(baoCao)) console.log(`${n.nhom.padEnd(14)} ${String(n.dat).padStart(2)}/${n.tong}  (cần >= ${n.nguong * 100}%)  ${n.qua ? "ĐẠT" : "TRƯỢT"}`);
  console.log(`Kết luận: ${quaCong(baoCao) ? "QUA CỔNG, có thể gộp" : "CHẶN, không gộp"}  (${baoCao.soLuotChay} lượt chạy agent, ${baoCao.soLuotGoiMoHinh} lượt gọi mô hình)\n`);
}
