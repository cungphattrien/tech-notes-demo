// Trước khi deploy: so sánh biến môi trường mà CODE dùng với biến mà `.env.example` KHAI BÁO.
// Biến code dùng mà không ai khai báo là biến người deploy sẽ quên đặt trên Vercel. Chạy: node kiem-env.ts <thư-mục-dự-án>
// Chỉ đọc file, không sửa gì. Nó chỉ thấy cách viết `process.env.TEN` hoặc `env.TEN`; cách đọc khác thì nó mù (xem bài).
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

export type Nguon = { file: string; noiDung: string };
export type KetQua = {
  /** Code dùng nhưng .env.example không khai báo. */
  thieuTrongMau: string[];
  /** .env.example khai báo nhưng code không thấy dùng (có thể là biến đọc kiểu động, hoặc biến thừa). */
  khongThayTrongCode: string[];
  /** Biến NEXT_PUBLIC_: Next.js ghi cứng giá trị vào bản build, đổi trên Vercel phải build lại. */
  congKhai: string[];
  /** Chỗ đọc biến bằng tên động (process.env[ten]): Next.js không ghi cứng được, trình duyệt sẽ không thấy giá trị. */
  docDong: { file: string; dong: number }[];
};

/** Biến do nền tảng hoặc công cụ đặt sẵn, không cần khai báo trong .env.example. */
const DO_NEN_TANG = /^(VERCEL(_.*)?|NODE_ENV|CI|NEXT_RUNTIME|NEXT_PHASE|PORT|TZ)$/;

const BIEN = /(?<![\w.])(?:process\.env|env)\.([A-Z][A-Z0-9_]{2,})\b/g;
const DOC_DONG = /process\.env\[/;

export function phanTich(nguon: Nguon[], envExample: string): KetQua {
  const dung = new Set<string>();
  const docDong: KetQua["docDong"] = [];
  for (const { file, noiDung } of nguon) {
    noiDung.split(/\r?\n/).forEach((dong, i) => {
      for (const m of dong.matchAll(BIEN)) dung.add(m[1]!);
      if (DOC_DONG.test(dong)) docDong.push({ file, dong: i + 1 });
    });
  }
  const khaiBao = new Set([...envExample.matchAll(/^([A-Z][A-Z0-9_]+)=/gm)].map((m) => m[1]!));
  const dungCanKhaiBao = [...dung].filter((b) => !DO_NEN_TANG.test(b));
  return {
    thieuTrongMau: dungCanKhaiBao.filter((b) => !khaiBao.has(b)).sort(),
    khongThayTrongCode: [...khaiBao].filter((b) => !dung.has(b)).sort(),
    congKhai: dungCanKhaiBao.filter((b) => b.startsWith("NEXT_PUBLIC_")).sort(),
    docDong,
  };
}

function* duyet(thuMuc: string): Generator<string> {
  for (const ten of readdirSync(thuMuc)) {
    if (ten === "node_modules" || ten.startsWith(".")) continue;
    const duong = join(thuMuc, ten);
    if (statSync(duong).isDirectory()) yield* duyet(duong);
    else if (/\.(ts|tsx|js|mjs)$/.test(ten) && !/\.test\./.test(ten)) yield duong;
  }
}

if (process.argv[1]?.endsWith("kiem-env.ts")) {
  const goc = process.argv[2];
  if (!goc) throw new Error("Cần thư mục dự án, ví dụ: node kiem-env.ts ../../tech-notes");
  const nguon: Nguon[] = [...(existsSync(join(goc, "src")) ? duyet(join(goc, "src")) : [])].map((f) => ({ file: f.slice(goc.length + 1).replaceAll("\\", "/"), noiDung: readFileSync(f, "utf8") }));
  for (const ten of ["next.config.ts", "next.config.mjs", "next.config.js"]) {
    if (existsSync(join(goc, ten))) nguon.push({ file: ten, noiDung: readFileSync(join(goc, ten), "utf8") });
  }
  const mau = existsSync(join(goc, ".env.example")) ? readFileSync(join(goc, ".env.example"), "utf8") : "";
  const kq = phanTich(nguon, mau);
  console.log(`Đã đọc ${nguon.length} file. Biến có trong .env.example: ${(mau.match(/^[A-Z][A-Z0-9_]+=/gm) ?? []).length}.`);
  console.log(`Code dùng nhưng .env.example không khai báo: ${kq.thieuTrongMau.length === 0 ? "(không có)" : kq.thieuTrongMau.join(", ")}`);
  console.log(`.env.example khai báo nhưng code không thấy dùng: ${kq.khongThayTrongCode.length === 0 ? "(không có)" : kq.khongThayTrongCode.join(", ")}`);
  console.log(`Biến NEXT_PUBLIC_ (ghi cứng lúc build): ${kq.congKhai.join(", ") || "(không có)"}`);
  console.log(`Chỗ đọc biến bằng tên động: ${kq.docDong.length === 0 ? "(không có)" : kq.docDong.map((d) => `${d.file}:${d.dong}`).join(", ")}`);
  process.exitCode = kq.thieuTrongMau.length > 0 ? 1 : 0;
}
