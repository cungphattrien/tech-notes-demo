// Chạy từng nhận xét như một phép thử, hai lần: một lần với múi giờ UTC (như máy chủ), một lần với giờ Việt Nam.
// Chạy: node kiem-nhan-xet.ts
import { execFileSync } from "node:child_process";

import { CAC_NHAN_XET } from "./src/nhan-xet.ts";

// Chế độ con: chạy các phép thử trong tiến trình hiện tại và in kết quả dạng JSON (múi giờ lấy từ biến TZ của tiến trình).
if (process.argv[2] === "--con") {
  console.log(JSON.stringify(CAC_NHAN_XET.map((nx) => (nx.kiem ? nx.kiem() : null))));
  process.exit(0);
}

// Múi giờ của Node được đọc lúc khởi động, nên muốn đổi múi giờ thì phải chạy tiến trình mới với biến TZ khác.
const chay = (tz: string): (boolean | null)[] =>
  JSON.parse(execFileSync(process.execPath, [import.meta.filename, "--con"], { env: { ...process.env, TZ: tz }, encoding: "utf8" }));

const ketQuaUtc = chay("UTC");
const ketQuaVn = chay("Asia/Ho_Chi_Minh");

for (const [i, nx] of CAC_NHAN_XET.entries()) {
  const utc = ketQuaUtc[i];
  const vn = ketQuaVn[i];
  const ketLuan = utc === null ? "ý kiến về cách viết, không kiểm bằng chạy thử" : utc || vn ? "XÁC NHẬN: nhận xét đúng" : "KHÔNG TÁI HIỆN: nhận xét sai";
  console.log(`#${nx.so} ${ketLuan}${utc !== vn && utc !== null ? ` (UTC: ${utc}, giờ VN: ${vn})` : ""}\n   "${nx.noiDung.slice(0, 90)}${nx.noiDung.length > 90 ? "…" : ""}"`);
}
