// Kiểm tra máy đã sẵn sàng làm việc chưa: bộ công cụ, danh tính Git, khóa SSH. Chỉ in ✓ hoặc ✗, không in giá trị cá nhân.
// Chạy: node kiem-may.ts
import { execFileSync } from "node:child_process";
import { existsSync, readdirSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

export type PhepKiem = { ten: string; kiem: () => boolean; goiY: string };

const chay = (lenh: string, doi: string[]): string => execFileSync(lenh, doi, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
const thu = (f: () => boolean) => () => {
  try {
    return f();
  } catch {
    return false;
  }
};

export const CAC_PHEP_KIEM: PhepKiem[] = [
  { ten: "Node.js 22.18 trở lên", kiem: thu(() => { const [major, minor] = process.versions.node.split(".").map(Number); return major > 22 || (major === 22 && minor >= 18); }), goiY: "Cài bản Node.js mà dự án yêu cầu (xem README hoặc .nvmrc)" },
  { ten: "Git đã cài", kiem: thu(() => chay("git", ["--version"]).startsWith("git version")), goiY: "Cài Git rồi mở lại terminal" },
  { ten: "Git đã có tên người dùng", kiem: thu(() => chay("git", ["config", "user.name"]).length > 0), goiY: 'git config --global user.name "Tên của bạn"' },
  { ten: "Git đã có email", kiem: thu(() => chay("git", ["config", "user.email"]).includes("@")), goiY: 'git config --global user.email "email-công-ty"' },
  { ten: "Có khóa SSH", kiem: thu(() => { const thuMuc = join(homedir(), ".ssh"); return existsSync(thuMuc) && readdirSync(thuMuc).some((ten) => /^id_(ed25519|rsa|ecdsa)$/.test(ten)); }), goiY: "Tạo khóa bằng ssh-keygen rồi gửi khóa công khai (.pub) cho người quản lý tài khoản" },
];

export function chayCacPhepKiem(cacPhep: PhepKiem[]): { dau: string; ten: string; goiY?: string }[] {
  return cacPhep.map((phep) => (phep.kiem() ? { dau: "✓", ten: phep.ten } : { dau: "✗", ten: phep.ten, goiY: phep.goiY }));
}

if (import.meta.main) {
  const ketQua = chayCacPhepKiem(CAC_PHEP_KIEM);
  for (const muc of ketQua) console.log(`${muc.dau} ${muc.ten}${muc.goiY ? `\n    gợi ý: ${muc.goiY}` : ""}`);
  console.log(`\n${ketQua.filter((m) => m.dau === "✓").length}/${ketQua.length} mục sẵn sàng`);
}
