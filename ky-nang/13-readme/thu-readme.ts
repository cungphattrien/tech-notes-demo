// Đóng vai người mới: chép dự án sang một thư mục trống (như vừa `git clone`: không có node_modules, không có .env),
// rồi chạy đúng các lệnh `npm ...` trong khối ```bash của một file README, theo thứ tự, và báo bước nào hỏng.
// Chạy: node thu-readme.ts README-cu.md   hoặc   node thu-readme.ts README.md
import { spawn, spawnSync } from "node:child_process";
import { cpSync, mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const DU_AN = process.cwd();
const README = process.argv[2];

/** Các lệnh `npm ...` trong khối ```bash, theo thứ tự xuất hiện. */
export function layLenh(markdown: string): string[] {
  const lenh: string[] = [];
  for (const khoi of markdown.matchAll(/```bash\r?\n([\s\S]*?)```/g)) {
    for (const dong of khoi[1]!.split(/\r?\n/)) {
      const l = dong.replace(/\s+#.*$/, "").trim();
      if (l.startsWith("npm ")) lenh.push(l);
    }
  }
  return lenh;
}

const duoi = (chu: string, soDong = 6) => chu.trim().split(/\r?\n/).slice(-soDong).map((d) => "      " + d).join("\n");

async function chayMayChu(thuMuc: string): Promise<string> {
  const con = spawn("npm", ["start"], { cwd: thuMuc, shell: true });
  let log = "";
  con.stdout.on("data", (d) => (log += d));
  con.stderr.on("data", (d) => (log += d));
  const batDau = Date.now();
  while (!/nghe ở cổng/.test(log) && con.exitCode === null && Date.now() - batDau < 8000) await new Promise((r) => setTimeout(r, 100));
  let ketQua = "";
  if (/nghe ở cổng/.test(log)) {
    const phanHoi = await fetch("http://localhost:3000/don-hang");
    const don = (await phanHoi.json()) as unknown[];
    ketQua = `GET /don-hang → ${phanHoi.status}, ${don.length} đơn hàng`;
  } else {
    ketQua = "LỖI\n" + duoi(log);
  }
  spawnSync("taskkill", ["/PID", String(con.pid), "/T", "/F"], { shell: false });
  con.kill();
  return ketQua;
}

if (process.argv[1]?.endsWith("thu-readme.ts")) {
  if (!README) throw new Error("Cần tên file README, ví dụ: node thu-readme.ts README.md");
  const thuMuc = mkdtempSync(join(tmpdir(), "readme-"));
  cpSync(DU_AN, thuMuc, {
    recursive: true,
    filter: (nguon) => !/(^|[\\/])(node_modules|\.env)$/.test(nguon),
  });
  const lenh = layLenh(readFileSync(join(DU_AN, README), "utf8"));
  console.log(`${README}: ${lenh.length} lệnh npm trong khối bash, chạy trong thư mục trống`);
  const batDau = Date.now();
  let hong = false;
  for (const l of lenh) {
    process.stdout.write(`$ ${l}  `);
    if (l === "npm start") {
      const ketQua = await chayMayChu(thuMuc);
      console.log(ketQua);
      hong = ketQua.startsWith("LỖI");
    } else {
      const kq = spawnSync(l, { cwd: thuMuc, shell: true, encoding: "utf8" });
      hong = kq.status !== 0;
      console.log(hong ? `LỖI (mã thoát ${kq.status})\n${duoi(kq.stdout + kq.stderr)}` : "ok");
    }
    if (hong) break;
  }
  console.log(`\n${hong ? "Người mới bị kẹt" : "Người mới chạy được"} sau ${((Date.now() - batDau) / 1000).toFixed(1)} giây (chưa tính thời gian đọc).`);
  process.exitCode = hong ? 1 : 0;
}
