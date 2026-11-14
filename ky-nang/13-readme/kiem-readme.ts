// Kiểm một README không bị "cũ": có đủ các mục người mới cần, mọi đường dẫn và lệnh npm nó nhắc tới đều còn tồn tại.
// Không kiểm được README có DỄ HIỂU hay không (việc đó cần một người thật làm theo, xem thu-readme.ts).
// Chạy: node kiem-readme.ts README.md
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const MUC_BAT_BUOC = ["Cần có", "Chạy lần đầu", "Chạy test", "Cấu hình", "Gặp lỗi"];

export type NganhCanh = { goc: string; scripts: Record<string, string> };

export function kiemReadme(markdown: string, { goc, scripts }: NganhCanh, tonTai: (duong: string) => boolean = existsSync): string[] {
  const loi: string[] = [];
  const tieuDe = [...markdown.matchAll(/^#{2,3}\s+(.+)$/gm)].map((m) => m[1]!);
  for (const muc of MUC_BAT_BUOC) {
    if (!tieuDe.some((t) => t.startsWith(muc))) loi.push(`Thiếu mục "${muc}".`);
  }
  // Chỉ xét chữ nằm trong dấu huyền ngoài khối code: bỏ các khối ``` trước.
  const vanBan = markdown.replace(/```[\s\S]*?```/g, "");
  for (const m of vanBan.matchAll(/`([^`\n]+)`/g)) {
    const chu = m[1]!.trim();
    if (/^https?:/.test(chu) || chu.includes(" ")) continue;
    const giongDuongDan = chu.includes("/") || /^[\w-][\w.-]*\.(ts|json|md)$/.test(chu);
    if (giongDuongDan && !chu.startsWith(".env") && !tonTai(join(goc, chu.replace(/:$/, "")))) loi.push(`Đường dẫn "${chu}" không còn tồn tại.`);
  }
  for (const m of markdown.matchAll(/`npm (run )?([\w:-]+)`|^\s*npm (run )?([\w:-]+)/gm)) {
    const ten = m[2] ?? m[4];
    const laRun = Boolean(m[1] ?? m[3]);
    const chay = laRun || ten === "start" || ten === "test";
    if (ten === "install" || ten === "ci") continue;
    if (chay && ten && !scripts[ten]) loi.push(`Lệnh "npm ${laRun ? "run " : ""}${ten}" nhưng package.json không có script "${ten}".`);
  }
  return [...new Set(loi)];
}

if (process.argv[1]?.endsWith("kiem-readme.ts")) {
  const file = process.argv[2];
  if (!file) throw new Error("Cần tên file, ví dụ: node kiem-readme.ts README.md");
  const goc = process.cwd();
  const scripts = JSON.parse(readFileSync(join(goc, "package.json"), "utf8")).scripts as Record<string, string>;
  const loi = kiemReadme(readFileSync(join(goc, file), "utf8"), { goc, scripts });
  console.log(loi.length === 0 ? `${file}: không thấy vấn đề` : `${file}: ${loi.length} vấn đề`);
  for (const l of loi) console.log("  ✗ " + l);
  process.exitCode = loi.length === 0 ? 0 : 1;
}
