// Chuẩn bị máy mới bằng một lệnh: tạo .env từ .env.example và điền sẵn một ORDER_API_KEY ngẫu nhiên.
// Chạy nhiều lần cũng an toàn: nếu .env đã có thì giữ nguyên, không bao giờ ghi đè khóa của bạn.
import { randomBytes } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

export function taoEnv(thuMuc: string): "da-tao" | "da-co" {
  const dich = join(thuMuc, ".env");
  if (existsSync(dich)) return "da-co";
  const mau = readFileSync(join(thuMuc, ".env.example"), "utf8");
  const khoa = randomBytes(24).toString("hex");
  writeFileSync(dich, mau.replace(/^ORDER_API_KEY=.*$/m, () => `ORDER_API_KEY=${khoa}`));
  return "da-tao";
}

if (process.argv[1]?.endsWith("setup.ts")) {
  const ketQua = taoEnv(process.cwd());
  console.log(ketQua === "da-tao" ? "Đã tạo .env với một ORDER_API_KEY ngẫu nhiên." : ".env đã có, giữ nguyên.");
}
