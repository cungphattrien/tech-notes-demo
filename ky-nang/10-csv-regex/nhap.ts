// Nhập file đơn cũ và in báo cáo. Chạy: node nhap.ts src/don-cu.csv
import { readFileSync } from "node:fs";

import { nhapCsv } from "./src/nhap-csv.ts";

const { hopLe, biLoai } = nhapCsv(readFileSync(process.argv[2] ?? "src/don-cu.csv", "utf8"));
console.log(`Đọc ${hopLe.length + biLoai.length} dòng: ${hopLe.length} hợp lệ, ${biLoai.length} bị loại.\n`);
for (const don of hopLe) console.log(`đơn ${don.maDon}  ${don.ngay}  ${(don.khach ?? "(tại quầy)").padEnd(14)} ${(don.sdt ?? "-").padEnd(10)} ${String(don.tong).padStart(6)}đ  ${don.mon.map((m) => `${m.soLuong} ${m.ten}`).join(", ")}`);
console.log("\nDòng bị loại (kèm lý do, để người kiểm tra tay):");
for (const loi of biLoai) console.log(`dòng ${loi.dong}: ${loi.lyDo}`);
