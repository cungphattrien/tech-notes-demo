// Quét một thư mục tìm bí mật còn nằm trong file, và kiểm tra .env đã được .gitignore loại trừ chưa.
// Chạy: node quet-thu-muc.ts <thư mục>, hoặc node quet-thu-muc.ts --demo (tự dựng một dự án mẫu trong thư mục tạm).
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, relative } from "node:path";

import { anBiMat } from "./src/bi-mat.ts";
import { BOT_TOKEN_GIA } from "./src/mau-log.ts";

const BO_QUA = new Set(["node_modules", ".git", ".next"]);
const laFileEnv = (ten: string) => /^\.env(\..+)?$/.test(ten) && ten !== ".env.example";

function* duyet(thuMuc: string): Generator<string> {
  for (const ten of readdirSync(thuMuc)) {
    if (BO_QUA.has(ten)) continue;
    const duongDan = join(thuMuc, ten);
    if (statSync(duongDan).isDirectory()) yield* duyet(duongDan);
    else yield duongDan;
  }
}

function dungDuAnMau(): string {
  const goc = mkdtempSync(join(tmpdir(), "du-an-mau-"));
  mkdirSync(join(goc, "src"));
  writeFileSync(join(goc, ".env"), `BOT_TOKEN=${BOT_TOKEN_GIA}\n`);
  writeFileSync(join(goc, ".env.example"), "BOT_TOKEN=your_token_here\n");
  writeFileSync(join(goc, ".gitignore"), "node_modules/\n"); // quên dòng .env: lỗi hay gặp
  writeFileSync(join(goc, "src", "chay-bot.ts"), `// Liên hệ: an.nguyen@example.com\nconst token = "${BOT_TOKEN_GIA}"; // dán tạm cho chạy thử\n`);
  return goc;
}

const thuMuc = process.argv[2] === "--demo" ? dungDuAnMau() : process.argv[2];
if (!thuMuc) throw new Error("Cách dùng: node quet-thu-muc.ts <thư mục> | --demo");

let soChoLo = 0;
for (const duongDan of duyet(thuMuc)) {
  const ten = duongDan.split(/[\\/]/).pop()!;
  if (laFileEnv(ten)) continue; // file .env được phép chứa bí mật; chỉ cần đừng để nó vào Git
  for (const p of anBiMat(readFileSync(duongDan, "utf8")).phatHien) {
    soChoLo++;
    console.log(`${relative(thuMuc, duongDan)}:${p.dong}  ${p.loai} (bắt đầu bằng ${p.xemTruoc})`);
  }
}
const gitignore = existsSync(join(thuMuc, ".gitignore")) ? readFileSync(join(thuMuc, ".gitignore"), "utf8") : "";
if (existsSync(join(thuMuc, ".env")) && !/^\.env\b/m.test(gitignore)) {
  soChoLo++;
  console.log("CẢNH BÁO: có file .env nhưng .gitignore không loại trừ nó, nên git add . sẽ đưa token vào kho");
}
console.log(soChoLo === 0 ? "Không thấy gì đáng ngờ (nhưng đây chỉ là lưới lọc)." : `Có ${soChoLo} chỗ cần xử lý.`);
