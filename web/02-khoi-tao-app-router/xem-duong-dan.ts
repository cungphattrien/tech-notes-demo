// In ra bảng "thư mục → đường dẫn" của một thư mục app/ theo quy ước App Router của Next.js.
// Chạy: node xem-duong-dan.ts <đường-dẫn-tới-thư-mục-app>
//
// Quy ước (theo tài liệu Next.js, mục Project structure):
//   - Mỗi thư mục là một đoạn của URL; chỉ thư mục có page.tsx (hoặc route.ts) mới thành trang công khai.
//   - (ten-nhom): nhóm route, không xuất hiện trong URL.
//   - _ten: thư mục riêng tư, Next.js bỏ qua cả thư mục lẫn thư mục con.
//   - [slug]: đoạn động, khớp mọi giá trị.
//   - @slot: slot của layout cha, không phải một đoạn URL.
import { readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

const root = process.argv[2];
if (!root) {
  console.error("Cách dùng: node xem-duong-dan.ts <thư-mục-app>");
  process.exit(1);
}

type Row = { url: string; file: string; kind: "trang" | "route" | "layout" };
const rows: Row[] = [];
const khongPhaiTrang: string[] = [];
const riengTu: string[] = [];

function toUrl(dir: string): string {
  const segments = relative(root, dir)
    .split(sep)
    .filter((s) => s && !(s.startsWith("(") && s.endsWith(")")) && !s.startsWith("@"));
  return "/" + segments.join("/");
}

function walk(dir: string) {
  const entries = readdirSync(dir);
  const files = entries.filter((e) => statSync(join(dir, e)).isFile());
  const page = files.find((f) => /^page\.(tsx|ts|jsx|js|mdx)$/.test(f));
  const route = files.find((f) => /^route\.(ts|js)$/.test(f));
  const layout = files.find((f) => /^layout\.(tsx|ts|jsx|js)$/.test(f));
  const rel = (f: string) => relative(root, join(dir, f)).split(sep).join("/");

  if (page) rows.push({ url: toUrl(dir), file: rel(page), kind: "trang" });
  if (route) rows.push({ url: toUrl(dir), file: rel(route), kind: "route" });
  if (layout) rows.push({ url: toUrl(dir), file: rel(layout), kind: "layout" });

  const subdirs = entries.filter((e) => statSync(join(dir, e)).isDirectory());
  if (!page && !route && dir !== root && subdirs.length === 0 && !layout) {
    khongPhaiTrang.push(relative(root, dir).split(sep).join("/") + "/");
  }
  for (const sub of subdirs) {
    if (sub.startsWith("_")) {
      riengTu.push(relative(root, join(dir, sub)).split(sep).join("/") + "/");
      continue;
    }
    walk(join(dir, sub));
  }
}

walk(root);

const width = Math.max(...rows.map((r) => r.url.length), 10);
for (const kind of ["trang", "route", "layout"] as const) {
  const list = rows.filter((r) => r.kind === kind).sort((a, b) => a.url.localeCompare(b.url));
  if (list.length === 0) continue;
  console.log(kind === "trang" ? "Trang công khai:" : kind === "route" ? "Route handler (trả dữ liệu, không phải trang):" : "Layout (bọc các trang bên dưới):");
  for (const r of list) console.log(`  ${r.url.padEnd(width)}  ←  ${r.file}`);
  console.log();
}
if (khongPhaiTrang.length) console.log(`Thư mục không có page.tsx, nên KHÔNG thành trang: ${khongPhaiTrang.join(", ")}`);
if (riengTu.length) console.log(`Thư mục riêng tư (bắt đầu bằng _), Next.js bỏ qua: ${riengTu.join(", ")}`);
