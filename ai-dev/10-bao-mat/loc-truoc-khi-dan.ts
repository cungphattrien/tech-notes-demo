// Che bí mật trong một đoạn văn bản trước khi dán cho AI. Chạy: node loc-truoc-khi-dan.ts [file]. Không có file thì dùng log mẫu.
import { readFileSync } from "node:fs";

import { anBiMat } from "./src/bi-mat.ts";
import { LOG_MAU } from "./src/mau-log.ts";

const vanBan = process.argv[2] ? readFileSync(process.argv[2], "utf8") : LOG_MAU;
const { sach, phatHien } = anBiMat(vanBan);
console.log(`--- Văn bản sau khi che\n${sach}\n--- Đã che ${phatHien.length} chỗ`);
for (const p of phatHien) console.log(`dòng ${p.dong}: ${p.loai} (bắt đầu bằng ${p.xemTruoc})`);
