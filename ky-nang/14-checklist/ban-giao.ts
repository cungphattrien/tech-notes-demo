// Sinh bản nháp ghi chú bàn giao từ thứ máy biết được: cách chạy (từ package.json), việc gần đây (từ git log),
// chỗ còn thiếu và cần để ý (từ kiem-du-an.ts). Những thứ chỉ người trong cuộc biết (vì sao quyết định thế, ai hỏi khi cần) máy không biết,
// nên bản nháp không bịa chúng: bạn thêm tay.
// Chạy: node ban-giao.ts <thư-mục-dự-án> [--lich-su <thư-mục-lấy-git-log>]
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { docThuMuc, kiemDuAn, type KetQua } from "./kiem-du-an.ts";

export type Commit = { ma: string; ngay: string; tieuDe: string };

export function taoBanGiao(opts: { ten: string; scripts: Record<string, string>; commits: Commit[]; kiem: KetQua[] }): string {
  const { ten, scripts, commits, kiem } = opts;
  const dong: string[] = [`# Bàn giao: ${ten}`, ""];

  dong.push("## Chạy dự án", "");
  // Chỉ start và test có dạng ngắn `npm start`, `npm test`; các script khác phải gõ `npm run <tên>`.
  const lenh = Object.entries(scripts).map(([k, v]) => `- \`${k === "start" || k === "test" ? `npm ${k}` : `npm run ${k}`}\`: ${v}`);
  dong.push(...(lenh.length > 0 ? lenh : ["- Không có script nào trong package.json."]), "");

  dong.push("## Việc gần đây", "");
  dong.push(...(commits.length > 0 ? commits.map((c) => `- ${c.ngay} (${c.ma}): ${c.tieuDe}`) : ["- Không đọc được lịch sử Git."]), "");

  const thieu = kiem.filter((k) => k.muc === "thieu");
  dong.push("## Còn thiếu", "");
  dong.push(...(thieu.length > 0 ? thieu.map((k) => `- ${k.cau} ${k.ghiChu}`) : ["- Không thấy chỗ nào thiếu trong 11 câu đã kiểm."]), "");

  const canhBao = kiem.filter((k) => k.muc === "canh-bao");
  dong.push("## Cần để ý", "");
  dong.push(...(canhBao.length > 0 ? canhBao.map((k) => `- ${k.cau} ${k.ghiChu}`) : ["- Không có cảnh báo."]), "");

  dong.push("## Phần máy không biết", "", "Vì sao các quyết định lớn được chọn, chỗ nào đang dở, ai hỏi khi cần: phần này người bàn giao phải viết tay.", "");
  return dong.join("\n");
}

function docCommits(thuMuc: string, soLuong = 8): Commit[] {
  const kq = spawnSync("git", ["log", "-n", String(soLuong), "--format=%h%x09%ad%x09%s", "--date=short", "--", "."], { cwd: thuMuc, encoding: "utf8" });
  if (kq.status !== 0) return [];
  return kq.stdout.split("\n").filter(Boolean).map((d) => {
    const [ma, ngay, ...tieuDe] = d.split("\t");
    return { ma: ma!, ngay: ngay!, tieuDe: tieuDe.join("\t") };
  });
}

if (process.argv[1]?.endsWith("ban-giao.ts")) {
  const [goc, co, lichSu] = process.argv.slice(2);
  if (!goc) throw new Error("Cách dùng: node ban-giao.ts <thư-mục-dự-án> [--lich-su <thư-mục>]");
  const pkg = JSON.parse(readFileSync(join(goc, "package.json"), "utf8")) as { name?: string; scripts?: Record<string, string> };
  const kiem = kiemDuAn(docThuMuc(goc));
  console.log(taoBanGiao({ ten: pkg.name ?? goc, scripts: pkg.scripts ?? {}, commits: docCommits(co === "--lich-su" && lichSu ? lichSu : goc), kiem }));
}
