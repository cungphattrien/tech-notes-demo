// In tình trạng các việc sau khi nhận xét. Chạy: node theo-doi.ts so-phan-hoi.txt 2026-12-16   (ngày là yyyy-mm-dd, bỏ trống thì lấy hôm nay)
import { readFileSync } from "node:fs";

import { docSo, tomTat } from "./src/theo-doi.ts";

const tep = process.argv[2];
if (!tep) throw new Error("Cần tên file, ví dụ: node theo-doi.ts so-phan-hoi.txt 2026-12-16");
const homNay = process.argv[3] ?? new Date().toISOString().slice(0, 10);
const cacViec = docSo(readFileSync(tep, "utf8"));

console.log(`Ngày ${homNay}: ${cacViec.length} việc`);
for (const [nhom, ds] of tomTat(cacViec, homNay)) {
  if (ds.length === 0) continue;
  console.log(`\n${nhom} (${ds.length})`);
  for (const v of ds) console.log(`  - ${v.moTa} (${v.tu}, hạn ${v.han.split("-").reverse().join("/")})`);
}
