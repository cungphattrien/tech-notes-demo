// Kiểm tra một file hướng dẫn cho AI (CLAUDE.md) còn khớp với dự án không.
// File này chỉ có giá trị khi những gì nó viết còn ĐÚNG: lệnh còn chạy được, đường dẫn còn tồn tại.
// Chạy: node kiem-claude-md.ts CLAUDE.md      (thoát với mã 1 nếu có lỗi, cảnh báo thì không)
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

export type VanDe = { muc: "loi" | "canh-bao"; dong: number; noiDung: string };
export type NguCanh = { tonTai: (duong: string) => boolean; scripts: string[] };

// Tài liệu của Claude Code khuyên mỗi file dưới khoảng 200 dòng: dài hơn thì tốn ngữ cảnh và AI tuân theo kém đi.
export const TOI_DA_DONG = 200;

// Những cụm nghe có vẻ đúng nhưng không bảo AI làm gì cụ thể. Danh sách này do mình tự gom, không đầy đủ.
const CUM_MO_HO = ["code sạch", "best practice", "viết code tốt", "cẩn thận", "tuân theo quy ước", "đúng chuẩn"];

const DUONG_DAN = /^(\.\/)?[\w.-]+(\/[\w.-]+)*\.(ts|js|mjs|md|json|sh|sql|yml)$/;

export function kiemTra(noiDung: string, ngu: NguCanh): VanDe[] {
  const dong = noiDung.split("\n");
  const vanDe: VanDe[] = [];
  if (dong.length > TOI_DA_DONG) {
    vanDe.push({ muc: "canh-bao", dong: TOI_DA_DONG + 1, noiDung: `File dài ${dong.length} dòng, nên dưới ${TOI_DA_DONG}.` });
  }

  let trongKhoiCode = false;
  dong.forEach((noi, i) => {
    if (noi.trim().startsWith("```")) {
      trongKhoiCode = !trongKhoiCode;
      return;
    }
    if (trongKhoiCode) return;
    const so = i + 1;

    for (const khop of noi.matchAll(/`([^`]+)`/g)) {
      const ma = khop[1];
      if (ma.startsWith("import ")) continue; // ví dụ cú pháp, đường dẫn tính từ file khác
      for (const lenh of ma.matchAll(/npm run ([\w:-]+)/g)) {
        if (!ngu.scripts.includes(lenh[1])) vanDe.push({ muc: "loi", dong: so, noiDung: `Lệnh "npm run ${lenh[1]}" không có trong package.json.` });
      }
      for (const lenh of ma.matchAll(/\bnpm (test|start)\b/g)) {
        if (!ngu.scripts.includes(lenh[1])) vanDe.push({ muc: "loi", dong: so, noiDung: `Lệnh "npm ${lenh[1]}" không có trong package.json.` });
      }
      for (const phan of ma.split(/\s+/)) {
        if (DUONG_DAN.test(phan) && !ngu.tonTai(phan.replace(/^\.\//, ""))) {
          vanDe.push({ muc: "loi", dong: so, noiDung: `Đường dẫn "${phan}" không tồn tại.` });
        }
      }
    }

    const thuong = noi.toLowerCase();
    for (const cum of CUM_MO_HO) {
      if (thuong.includes(cum)) vanDe.push({ muc: "canh-bao", dong: so, noiDung: `Câu mơ hồ ("${cum}"): hãy thay bằng một lệnh hay quy tắc kiểm được.` });
    }
  });
  return vanDe;
}

function chayDong(lenh: string[]): number {
  const file = lenh[0];
  if (!file) throw new Error("Cần tên file, ví dụ: node kiem-claude-md.ts CLAUDE.md");
  const goc = process.cwd();
  const goi = JSON.parse(readFileSync(resolve(goc, "package.json"), "utf8")) as { scripts?: Record<string, string> };
  const vanDe = kiemTra(readFileSync(resolve(goc, file), "utf8"), {
    scripts: Object.keys(goi.scripts ?? {}),
    tonTai: (duong) => existsSync(resolve(goc, duong)),
  });
  const soLoi = vanDe.filter((v) => v.muc === "loi").length;
  console.log(`${file}: ${soLoi} lỗi, ${vanDe.length - soLoi} cảnh báo`);
  for (const v of vanDe) console.log(`  ${v.muc === "loi" ? "✗" : "!"} dòng ${String(v.dong).padStart(2)}: ${v.noiDung}`);
  return soLoi > 0 ? 1 : 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) process.exitCode = chayDong(process.argv.slice(2));
