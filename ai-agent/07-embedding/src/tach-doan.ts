import { readFileSync } from "node:fs";

export type Doan = { tieuDe: string; noiDung: string };

// Tách tài liệu Markdown thành các đoạn: mỗi tiêu đề "## ..." mở một đoạn mới.
export function tachDoan(markdown: string): Doan[] {
  return markdown
    .split(/^## /m)
    .slice(1) // phần trước "## " đầu tiên chỉ là tiêu đề chung của tài liệu
    .map((khoi) => {
      const [tieuDe, ...dong] = khoi.split("\n");
      return { tieuDe: tieuDe.trim(), noiDung: dong.join("\n").trim() };
    });
}

export function docChinhSach(): Doan[] {
  return tachDoan(readFileSync(new URL("../chinh-sach.md", import.meta.url), "utf8"));
}
