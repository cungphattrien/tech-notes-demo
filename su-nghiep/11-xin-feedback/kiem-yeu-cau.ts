// Chấm một tin nhắn xin nhận xét trước khi gửi. Chạy: node kiem-yeu-cau.ts yeu-cau-xau.txt
import { readFileSync } from "node:fs";

import { kiemTra } from "./src/kiem-yeu-cau.ts";

const tep = process.argv[2];
if (!tep) throw new Error("Cần tên file, ví dụ: node kiem-yeu-cau.ts yeu-cau-tot.txt");
const ketQua = kiemTra(readFileSync(tep, "utf8"));
console.log(`${tep}: ${ketQua.filter((k) => k.dat).length}/${ketQua.length} phần`);
for (const { phep, dat } of ketQua) console.log(`  ${dat ? "✓" : "✗"} ${phep}`);
