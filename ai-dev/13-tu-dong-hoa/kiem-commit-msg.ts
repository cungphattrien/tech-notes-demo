// Kiểm dòng đầu của tin nhắn commit theo quy ước kiểu(phạm vi): mô tả. Chỉ kiểm HÌNH THỨC, không kiểm tin nhắn có đúng ý hay không:
// việc viết một tin nhắn nói đúng điều đã đổi cần hiểu thay đổi, nên đó là việc để người hoặc AI làm (xem tập 8).
// Chạy: node kiem-commit-msg.ts <file-tin-nhan>
import { readFileSync } from "node:fs";

const KIEU = /^(feat|fix|docs|test|refactor|chore|perf|build|ci|style)(\([\w-]+\))?!?: \S.*/;
const MO_HO = /^(fix|ok|xong|update|sua|sửa|test|wip|\.+)$/i;

export function kiemTieuDe(tieuDe: string): string[] {
  const loi: string[] = [];
  if (tieuDe.startsWith("Merge ") || tieuDe.startsWith("Revert ")) return loi; // Git tự sinh, không bắt người viết
  if (MO_HO.test(tieuDe.trim())) loi.push(`"${tieuDe}" không nói gì về thay đổi.`);
  else if (!KIEU.test(tieuDe)) loi.push("Dòng đầu phải có dạng kiểu(phạm vi): mô tả, ví dụ fix(bot): sửa tổng tháng khi xóa khoản chi.");
  if (tieuDe.length > 72) loi.push(`Dòng đầu dài ${tieuDe.length} ký tự, nên tối đa 72.`);
  if (tieuDe.endsWith(".")) loi.push("Dòng đầu không nên kết thúc bằng dấu chấm.");
  return loi;
}

if (process.argv[1]?.endsWith("kiem-commit-msg.ts")) {
  const file = process.argv[2];
  if (!file) throw new Error("Cần đường dẫn file tin nhắn commit");
  const tieuDe = readFileSync(file, "utf8").split(/\r?\n/).find((d) => d.trim() !== "" && !d.startsWith("#")) ?? "";
  const loi = kiemTieuDe(tieuDe);
  for (const l of loi) console.error("✗ " + l);
  process.exitCode = loi.length > 0 ? 1 : 0;
}
