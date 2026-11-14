// Kiểm tra một file workflow GitHub Actions mà không cần đẩy lên GitHub: lỗi thường gặp thì bắt được ngay trên máy.
// Chỉ kiểm vài quy tắc mình đặt; nó KHÔNG thay cho việc chạy thật trên GitHub (xem README).
// Chạy: node kiem-ci.ts .github/workflows/ci.yml
import { existsSync, readFileSync } from "node:fs";
import { parse } from "yaml";

type Buoc = { run?: string; uses?: string; with?: Record<string, string> };

export function kiemCi(noiDung: string, scripts: Record<string, string>, tonTai: (duongDan: string) => boolean): string[] {
  const loi: string[] = [];
  const wf = parse(noiDung) as { permissions?: unknown; concurrency?: unknown; jobs?: Record<string, { steps?: Buoc[] }> };
  if (!wf.permissions) loi.push("Thiếu `permissions:`; mặc định token của workflow có thể có quyền ghi, hãy đặt `contents: read`.");
  if (!wf.concurrency) loi.push("Thiếu `concurrency:`; mỗi lần đẩy mới sẽ chạy tiếp cả lượt cũ, tốn phút chạy.");
  for (const [tenJob, job] of Object.entries(wf.jobs ?? {})) {
    for (const buoc of job.steps ?? []) {
      for (const lenh of (buoc.run ?? "").split("\n")) {
        const l = lenh.trim();
        if (l === "npm install" || l.startsWith("npm install ")) loi.push(`${tenJob}: dùng \`npm ci\` thay vì \`${l}\`; npm install có thể sửa package-lock.json thay vì báo lệch.`);
        const m = l.match(/^npm run ([\w:-]+)/);
        if (m && !scripts[m[1]!]) loi.push(`${tenJob}: \`${l}\` nhưng package.json không có script "${m[1]}".`);
        if (l === "npm test" && !scripts.test) loi.push(`${tenJob}: \`npm test\` nhưng package.json không có script "test".`);
      }
      const file = buoc.uses?.startsWith("actions/setup-node") ? buoc.with?.["node-version-file"] : undefined;
      if (file && !tonTai(file)) loi.push(`${tenJob}: node-version-file trỏ tới "${file}" nhưng file này không tồn tại.`);
    }
  }
  return loi;
}

if (process.argv[1]?.endsWith("kiem-ci.ts")) {
  const file = process.argv[2];
  if (!file) throw new Error("Cần tên file workflow, ví dụ: node kiem-ci.ts .github/workflows/ci.yml");
  const scripts = JSON.parse(readFileSync("package.json", "utf8")).scripts as Record<string, string>;
  const loi = kiemCi(readFileSync(file, "utf8"), scripts, existsSync);
  console.log(loi.length === 0 ? `${file}: không thấy lỗi` : `${file}: ${loi.length} vấn đề`);
  for (const l of loi) console.log("  ✗ " + l);
  process.exitCode = loi.length === 0 ? 0 : 1;
}
