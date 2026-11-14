// Khám một dự án mới nhận bằng 11 câu hỏi mà mình thấy nên hỏi trước khi sửa dòng code đầu tiên.
// Chỉ đọc file, không chạy code của dự án, không sửa gì. Mỗi câu trả lời là: đạt, thiếu, cảnh báo, hoặc không áp dụng.
// Chạy: node kiem-du-an.ts <thư-mục-dự-án>
import { spawnSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

export type Muc = "dat" | "thieu" | "canh-bao" | "khong-ap-dung";
export type KetQua = { cau: string; muc: Muc; ghiChu: string };
/** Cách nhìn một thư mục dưới dạng tên file (đường dẫn dùng `/`) và nội dung, để kiểm được mà không cần ổ đĩa thật. */
export type DuAn = { files: { duong: string; noiDung: string; byte: number }[] };

const co = (da: DuAn, duong: string) => da.files.some((f) => f.duong === duong);
const doc = (da: DuAn, duong: string) => da.files.find((f) => f.duong === duong)?.noiDung ?? null;
const laMa = (duong: string) => /\.(ts|tsx|js|jsx|mjs|cjs)$/.test(duong);
const laTest = (duong: string) => /\.(test|spec)\.(ts|tsx|js|jsx|mjs)$/.test(duong);
const dungEnv = (da: DuAn) => da.files.some((f) => laMa(f.duong) && !laTest(f.duong) && /process\.env\b/.test(f.noiDung));

const MAU_BI_MAT = /(sk-[A-Za-z0-9]{20,}|AKIA[0-9A-Z]{16}|-----BEGIN [A-Z ]*PRIVATE KEY-----|(?:api[_-]?key|secret|password)\s*[:=]\s*["'][^"'\s]{12,}["'])/i;

export function kiemDuAn(da: DuAn): KetQua[] {
  const goi = doc(da, "package.json");
  const pkg = goi ? (JSON.parse(goi) as { scripts?: Record<string, string>; engines?: { node?: string }; dependencies?: object; devDependencies?: object }) : null;
  const readme = doc(da, "README.md");
  const ketQua: KetQua[] = [];
  const them = (cau: string, muc: Muc, ghiChu: string) => ketQua.push({ cau, muc, ghiChu });

  // 1
  if (!readme) them("README cho biết cách chạy?", "thieu", "Không có README.md.");
  else if (!/```(bash|sh)?\s*\n[\s\S]*?(npm|node|pnpm|yarn)\s/i.test(readme)) them("README cho biết cách chạy?", "thieu", "Có README.md nhưng không có khối lệnh nào để chạy.");
  else them("README cho biết cách chạy?", "dat", "Có README.md với khối lệnh.");

  // 2
  const chay = pkg?.scripts?.start ?? pkg?.scripts?.dev;
  them("Có một lệnh chạy (npm start hoặc npm run dev)?", chay ? "dat" : "thieu", chay ? `Có: ${chay}` : pkg ? "package.json không có script start hoặc dev." : "Không có package.json.");

  // 3
  const soTest = da.files.filter((f) => laTest(f.duong)).length;
  if (pkg?.scripts?.test && soTest > 0) them("Có test chạy được bằng một lệnh?", "dat", `Có script test và ${soTest} file test.`);
  else them("Có test chạy được bằng một lệnh?", "thieu", `Script test: ${pkg?.scripts?.test ? "có" : "không"}; file test: ${soTest}.`);

  // 4
  const node = pkg?.engines?.node ?? doc(da, ".node-version")?.trim() ?? doc(da, ".nvmrc")?.trim();
  them("Ghi rõ phiên bản Node?", node ? "dat" : "thieu", node ? `Có: ${node}` : "Không thấy engines.node, .node-version hay .nvmrc.");

  // 5
  const coPhuThuoc = Boolean(pkg && (Object.keys(pkg.dependencies ?? {}).length + Object.keys(pkg.devDependencies ?? {}).length > 0));
  if (!coPhuThuoc) them("Có lockfile để cài đúng phiên bản thư viện?", "khong-ap-dung", "Dự án không có thư viện ngoài.");
  else them("Có lockfile để cài đúng phiên bản thư viện?", ["package-lock.json", "yarn.lock", "pnpm-lock.yaml"].some((f) => co(da, f)) ? "dat" : "thieu", "Có thư viện ngoài.");

  // 6
  if (!dungEnv(da)) them("Biến môi trường được khai báo trong .env.example?", "khong-ap-dung", "Code không đọc biến môi trường.");
  else them("Biến môi trường được khai báo trong .env.example?", co(da, ".env.example") ? "dat" : "thieu", co(da, ".env.example") ? "Code dùng biến môi trường và có .env.example." : "Code dùng process.env nhưng không có .env.example.");

  // 7
  const gitignore = doc(da, ".gitignore") ?? "";
  const thieuIgnore = [!/^\.env\s*$/m.test(gitignore) && (dungEnv(da) || co(da, ".env")) ? ".env" : "", pkg && !/^node_modules\/?\s*$/m.test(gitignore) ? "node_modules" : ""].filter(Boolean);
  if (!dungEnv(da) && !pkg && !co(da, ".env")) them(".gitignore chặn .env và node_modules?", "khong-ap-dung", "Không có biến môi trường hay thư viện.");
  else them(".gitignore chặn .env và node_modules?", thieuIgnore.length === 0 ? "dat" : "thieu", thieuIgnore.length === 0 ? "Có." : `.gitignore chưa chặn: ${thieuIgnore.join(", ")}.`);

  // 8
  const coCi = da.files.some((f) => /^\.github\/workflows\/[^/]+\.ya?ml$/.test(f.duong));
  them("Có CI chạy kiểm tra mỗi lần đẩy code?", coCi ? "dat" : "thieu", coCi ? "Có workflow trong .github/workflows." : "Không thấy .github/workflows.");

  // 9
  const loBiMat = da.files.filter((f) => !/^\.env(\.|$)/.test(f.duong.split("/").pop()!) && !/\.example$/.test(f.duong) && !laTest(f.duong) && /\.(ts|tsx|js|mjs|json|md|ya?ml|sh)$/.test(f.duong) && MAU_BI_MAT.test(f.noiDung)).map((f) => f.duong);
  them("Có khóa hoặc mật khẩu nằm trong code?", loBiMat.length === 0 ? "dat" : "canh-bao", loBiMat.length === 0 ? "Không thấy mẫu khóa quen thuộc (chỉ là các mẫu mình biết, không đầy đủ)." : `Có thể có khóa trong: ${loBiMat.slice(0, 3).join(", ")}.`);

  // 10
  const no: string[] = [];
  for (const f of da.files.filter((x) => laMa(x.duong) && !laTest(x.duong))) {
    f.noiDung.split(/\r?\n/).forEach((d, i) => {
      if (/\/\/\s*(TODO|FIXME)\b|\/\*\s*(TODO|FIXME)\b/.test(d)) no.push(`${f.duong}:${i + 1}`);
    });
  }
  them("Có bao nhiêu TODO/FIXME còn nợ?", no.length === 0 ? "dat" : "canh-bao", no.length === 0 ? "Không có." : `${no.length} chỗ, ví dụ ${no.slice(0, 3).join(", ")}.`);

  // 11
  const lon = da.files.filter((f) => f.byte > 1_000_000).map((f) => f.duong);
  them("Có file nào lớn bất thường (trên 1 MB)?", lon.length === 0 ? "dat" : "canh-bao", lon.length === 0 ? "Không." : `Có: ${lon.slice(0, 3).join(", ")}.`);

  return ketQua;
}

const BO_QUA = new Set(["node_modules", ".git", ".next", "dist", "build", "coverage"]);

const DOC_DUOC = /\.(ts|tsx|js|jsx|mjs|cjs|json|md|ya?ml|sh|example|gitignore|txt)$|^\.|\.env/;
const docNoiDung = (duong: string, ten: string, byte: number) => (byte <= 1_000_000 && DOC_DUOC.test(ten) ? readFileSync(duong, "utf8") : "");

/**
 * Đọc một thư mục thật thành DuAn. Nếu thư mục nằm trong một kho Git thì chỉ lấy file mà người clone sẽ có
 * (đã theo dõi, hoặc mới nhưng chưa bị .gitignore chặn). Ngược lại duyệt cả thư mục, bỏ qua node_modules, .git, .next...
 * File nhị phân hoặc quá lớn chỉ ghi kích thước, không đọc nội dung.
 */
export function docThuMuc(goc: string): DuAn {
  const git = spawnSync("git", ["ls-files", "-z", "--cached", "--others", "--exclude-standard"], { cwd: goc, encoding: "utf8" });
  if (git.status === 0 && git.stdout.length > 0) {
    const files: DuAn["files"] = [];
    for (const duongTuongDoi of git.stdout.split("\0").filter(Boolean)) {
      const duong = join(goc, duongTuongDoi);
      if (!existsSync(duong)) continue; // file đã bị xóa nhưng Git còn nhớ
      const byte = statSync(duong).size;
      files.push({ duong: duongTuongDoi, byte, noiDung: docNoiDung(duong, duongTuongDoi.split("/").pop()!, byte) });
    }
    return { files };
  }
  const files: DuAn["files"] = [];
  const duyet = (thuMuc: string, tienTo: string) => {
    for (const ten of readdirSync(thuMuc)) {
      if (BO_QUA.has(ten)) continue;
      const duong = join(thuMuc, ten);
      const st = statSync(duong);
      if (st.isDirectory()) duyet(duong, `${tienTo}${ten}/`);
      else files.push({ duong: `${tienTo}${ten}`, byte: st.size, noiDung: docNoiDung(duong, ten, st.size) });
    }
  };
  duyet(goc, "");
  return { files };
}

if (process.argv[1]?.endsWith("kiem-du-an.ts")) {
  const goc = process.argv[2];
  if (!goc || !existsSync(goc)) throw new Error("Cần thư mục dự án, ví dụ: node kiem-du-an.ts ../00-ban-dau");
  const kq = kiemDuAn(docThuMuc(goc));
  const ap = kq.filter((k) => k.muc !== "khong-ap-dung");
  const dau = { dat: "✓", thieu: "✗", "canh-bao": "!", "khong-ap-dung": "-" } as const;
  console.log(`${goc}: đạt ${ap.filter((k) => k.muc === "dat").length}/${ap.length} câu áp dụng`);
  for (const k of kq) console.log(`  ${dau[k.muc]} ${k.cau}\n      ${k.ghiChu}`);
}
