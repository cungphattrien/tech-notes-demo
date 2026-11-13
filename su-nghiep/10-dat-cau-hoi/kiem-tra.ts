// Chấm một tin nhắn hỏi trước khi gửi. Chạy: node kiem-tra.ts cau-hoi-xau.txt
import { readFileSync } from "node:fs";

import { kiemTra } from "./src/kiem-tra-cau-hoi.ts";

const tep = process.argv[2];
if (!tep) throw new Error("Cần tên file, ví dụ: node kiem-tra.ts cau-hoi-tot.txt");
const ketQua = kiemTra(readFileSync(tep, "utf8"));
console.log(`${tep}: ${ketQua.filter((k) => k.dat).length}/${ketQua.length} phần`);
for (const { phep, dat } of ketQua) console.log(`  ${dat ? "✓" : "✗"} ${phep}`);
