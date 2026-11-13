// Hai cách làm đầu tiên (đều sai) trên dòng 4 của file don-cu.csv. Chạy: node thu-cach-ngay-tho.ts
import { readFileSync } from "node:fs";

const cacDong = readFileSync("src/don-cu.csv", "utf8").split(/\r?\n/);
const dong4 = cacDong[3]; // đơn 2003, tên khách là "Lê, Văn Cường"

console.log(`Dòng gốc:      ${dong4}`);
const o = dong4.split(",");
console.log(`split(","):    ${o.length} ô (cần 6)`);
console.log(`  ô thứ 3 (khách): ${o[2]}`);
console.log(`  ô thứ 4 (sdt):   ${o[3]}`);
console.log(`  ô thứ 6 (tổng):  ${o[5]}`);

console.log("\nKiểm tra số điện thoại bằng /^0\\d{9}$/ ngay trên ô gốc:");
for (const sdt of ["0901000001", "0901 000 001", "+84 902 000 002", "(090)1000003"]) console.log(`  ${JSON.stringify(sdt).padEnd(20)} → ${/^0\d{9}$/.test(sdt)}`);
