// Một cái nhìn trước khi bấm "chấp nhận" một thay đổi do AI viết: diff này có những dấu hiệu nào đáng đọc kỹ?
// Chỉ nhìn danh sách file và số dòng (đầu ra của `git diff --numstat`), KHÔNG đọc nội dung nên không biết code đúng hay sai.
// Chạy: node kiem-diff.ts <thư-mục-repo> <commit>        hoặc        node kiem-diff.ts <thư-mục-repo> --lich-su <đường-dẫn>
import { spawnSync } from "node:child_process";

export type Thay = { them: number; xoa: number; duong: string };
export type PhatHien = { ma: "sua-code-khong-test" | "xoa-test" | "diff-lon" | "file-nhay-cam" | "nhieu-file"; noiDung: string };

export const NGUONG_DONG = 300;
export const NGUONG_FILE = 20;

/** Đọc đầu ra `git diff --numstat` (mỗi dòng: thêm TAB xóa TAB đường-dẫn; file nhị phân ghi "-"). */
export function docNumstat(chu: string): Thay[] {
  return chu
    .split(/\r?\n/)
    .filter((d) => d.trim() !== "")
    .map((d) => {
      const [them, xoa, ...duong] = d.split("\t");
      return { them: Number(them) || 0, xoa: Number(xoa) || 0, duong: duong.join("\t") };
    });
}

const laTest = (duong: string) => /\.(test|spec)\.(ts|tsx|js|jsx|mjs)$/.test(duong);
const laMa = (duong: string) => /\.(ts|tsx|js|jsx|mjs|cjs)$/.test(duong) && !laTest(duong);
// File mà một thay đổi sai có thể làm hỏng nhiều thứ cùng lúc: cấu hình, thư viện, CI, cơ sở dữ liệu, biến môi trường thật.
const NHAY_CAM = /(^|\/)(\.env(\.[\w.-]+)?|package\.json|package-lock\.json|tsconfig[\w.-]*\.json|vercel\.json)$|(^|\/)\.github\/workflows\/|\.sql$/;

export function kiemDiff(thay: Thay[]): PhatHien[] {
  const ra: PhatHien[] = [];
  const test = thay.filter((t) => laTest(t.duong));
  const ma = thay.filter((t) => laMa(t.duong));
  if (ma.length > 0 && test.length === 0) ra.push({ ma: "sua-code-khong-test", noiDung: `Sửa ${ma.length} file code nhưng không có file test nào thay đổi.` });
  const themTest = test.reduce((s, t) => s + t.them, 0);
  const xoaTest = test.reduce((s, t) => s + t.xoa, 0);
  if (xoaTest > themTest) ra.push({ ma: "xoa-test", noiDung: `Test bị xóa ${xoaTest} dòng, chỉ thêm ${themTest} dòng: bớt kiểm tra là dấu hiệu cần hỏi vì sao.` });
  const tongDong = thay.reduce((s, t) => s + t.them + t.xoa, 0);
  if (tongDong > NGUONG_DONG) ra.push({ ma: "diff-lon", noiDung: `Thay đổi ${tongDong} dòng, trên ngưỡng ${NGUONG_DONG}: khó đọc kỹ trong một lần.` });
  const nhayCam = thay.filter((t) => NHAY_CAM.test(t.duong) && !/\.example$/.test(t.duong)).map((t) => t.duong);
  if (nhayCam.length > 0) ra.push({ ma: "file-nhay-cam", noiDung: `Đụng tới file nhạy cảm: ${nhayCam.slice(0, 3).join(", ")}${nhayCam.length > 3 ? "…" : ""}.` });
  if (thay.length > NGUONG_FILE) ra.push({ ma: "nhieu-file", noiDung: `Thay đổi trải trên ${thay.length} file, trên ngưỡng ${NGUONG_FILE}.` });
  return ra;
}

const git = (repo: string, ...args: string[]) => spawnSync("git", args, { cwd: repo, encoding: "utf8" }).stdout;

if (process.argv[1]?.endsWith("kiem-diff.ts")) {
  const [repo, a, b] = process.argv.slice(2);
  if (!repo || !a) throw new Error("Cách dùng: node kiem-diff.ts <repo> <commit>  |  node kiem-diff.ts <repo> --lich-su <đường-dẫn>");
  if (a !== "--lich-su") {
    const thay = docNumstat(git(repo, "show", "--numstat", "--format=", a));
    const ra = kiemDiff(thay);
    console.log(`${a}: ${thay.length} file, ${thay.reduce((s, t) => s + t.them + t.xoa, 0)} dòng`);
    for (const p of ra) console.log(`  ! ${p.noiDung}`);
    if (ra.length === 0) console.log("  Không có dấu hiệu nào.");
  } else {
    const cacCommit = git(repo, "log", "--format=%h\t%s", "--", b!).split("\n").filter(Boolean).reverse();
    const dem: Record<string, number> = {};
    for (const dong of cacCommit) {
      const [ma, ...tieuDe] = dong.split("\t");
      const thay = docNumstat(git(repo, "show", "--numstat", "--format=", ma!));
      const ra = kiemDiff(thay);
      for (const p of ra) dem[p.ma] = (dem[p.ma] ?? 0) + 1;
      console.log(`${ma}  ${String(thay.length).padStart(3)} file ${String(thay.reduce((s, t) => s + t.them + t.xoa, 0)).padStart(5)} dòng  ${ra.map((p) => p.ma).join(", ") || "-"}   ${tieuDe.join("\t").slice(0, 48)}`);
    }
    console.log(`\n${cacCommit.length} commit chạm tới ${b}. Số commit có từng dấu hiệu: ${JSON.stringify(dem)}`);
  }
}
