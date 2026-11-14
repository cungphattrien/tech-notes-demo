// Cùng task đó, nhìn từng cuối ngày: khi nào Minh nên báo? Rồi kiểm hai bản báo cáo.
// Chạy: node thu-tien-do.ts   (mọi con số "còn lại" là minh họa)
import { readFileSync } from "node:fs";
import { duBao, kiemBaoCao } from "./src/tien-do.ts";

const UOC_GOC = 10; // "hai ngày" = 10 giờ tập trung
const CUOI_NGAY = [
  { ngay: "Thứ hai", daDung: 5, conLai: 6.5 },
  { ngay: "Thứ ba", daDung: 10, conLai: 8 }, // lúc này Minh phát hiện báo cáo lệch múi giờ
  { ngay: "Thứ tư", daDung: 15, conLai: 4 },
];
for (const { ngay, daDung, conLai } of CUOI_NGAY) {
  const d = duBao({ uocGoc: UOC_GOC, daDung, conLai });
  console.log(`Cuối ${ngay.toLowerCase()}: đã dùng ${daDung}, còn ${conLai} → dự kiến ${d.gioDuKien} giờ (${d.lechPhanTram >= 0 ? "+" : ""}${d.lechPhanTram}% so với ước lượng) ${d.canBaoNgay ? "→ BÁO NGAY" : "→ chưa cần báo"}`);
}

for (const file of ["bao-cao-xau.txt", "bao-cao-tot.txt"]) {
  const kq = kiemBaoCao(readFileSync(file, "utf8"));
  console.log(`\n${file}: ${kq.filter((k) => k.dat).length}/${kq.length} phần`);
  for (const k of kq) console.log(`  ${k.dat ? "✓" : "✗"} ${k.ten}${k.dat ? "" : `\n      ${k.loiNhan}`}`);
}
