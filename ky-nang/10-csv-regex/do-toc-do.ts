// Nhập một file lớn: lặp 9 dòng dữ liệu của don-cu.csv 400 lần (3.600 dòng) và đo thời gian. Chạy: node do-toc-do.ts
import { readFileSync } from "node:fs";

import { nhapCsv } from "./src/nhap-csv.ts";

const [tieuDe, ...cacDong] = readFileSync("src/don-cu.csv", "utf8").trim().split(/\r?\n/);
const fileLon = [tieuDe, ...Array.from({ length: 400 }, () => cacDong).flat()].join("\n");

const batDau = performance.now();
const { hopLe, biLoai } = nhapCsv(fileLon);
console.log(`${hopLe.length + biLoai.length} dòng: ${hopLe.length} hợp lệ, ${biLoai.length} bị loại, mất ${Math.round(performance.now() - batDau)} ms`);
