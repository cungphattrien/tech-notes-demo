// Tổng tháng 12/2026 của cùng bốn khoản chi, tính bằng bản cũ và bản đã sửa, trên máy chạy hai múi giờ khác nhau.
// Chạy: node so-sanh-hai-ban.ts
import { execFileSync } from "node:child_process";

import { tongTheoThang as tongCu, type Khoan } from "./src/tong-thang.ts";
import { tongTheoThang as tongMoi } from "./src/tong-thang-sua.ts";

if (process.argv[2] === "--con") {
  const cacKhoan: Khoan[] = [
    { luc: "2026-12-01T06:30:00+07:00", soTien: 29_000, ghiChu: "cà phê" },
    { luc: "2026-11-30T23:59:59+07:00", soTien: 10_000, ghiChu: "bánh mì" },
    { luc: "2026-12-31T23:59:59+07:00", soTien: 5_000, ghiChu: "trà" },
    { luc: "2027-01-01T00:00:00+07:00", soTien: 7_000, ghiChu: "bạc xỉu" },
  ];
  console.log(JSON.stringify({ cu: tongCu([...cacKhoan], "2026-12"), moi: tongMoi(cacKhoan, "2026-12") }));
  process.exit(0);
}

for (const tz of ["Asia/Ho_Chi_Minh", "UTC"]) {
  const ra = JSON.parse(execFileSync(process.execPath, [import.meta.filename, "--con"], { env: { ...process.env, TZ: tz }, encoding: "utf8" }));
  console.log(`máy chạy ${tz.padEnd(16)}: bản cũ ${ra.cu}, bản đã sửa ${ra.moi}`);
}
console.log("đúng phải là 34000 (29000 + 5000)");
