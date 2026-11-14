// Một lệnh thay cho ba việc mình vẫn gõ tay trước mỗi commit: kiểm kiểu, chạy test, kiểm CLAUDE.md.
// Mặc định dừng ở bước đầu tiên hỏng (không cần xem tiếp khi đã đỏ). `--het` chạy hết cả ba để thấy mọi lỗi cùng lúc.
// Chạy: node kiem.ts [--het]      (hoặc npm run kiem)
import { spawnSync } from "node:child_process";

export const BUOC = [
  { ten: "Kiểm kiểu", lenh: "npm run kiem-kieu --silent" },
  { ten: "Test", lenh: "npm test --silent" },
  { ten: "CLAUDE.md còn khớp", lenh: "npm run kiem-claude-md --silent" },
];

// Ưu tiên các dòng nói lỗi là gì ("not ok", "error"); nếu không có dòng nào thì lấy phần cuối của output.
const duoi = (chu: string, soDong = 6) => {
  const dong = chu.trim().split(/\r?\n/);
  const loi = dong.filter((d) => /not ok|error|✗/i.test(d));
  return (loi.length > 0 ? loi : dong).slice(-soDong).map((d) => "      " + d.trim()).join("\n");
};

export function chayKiem(het: boolean, cwd = process.cwd()): { dat: boolean; dong: string[] } {
  const dong: string[] = [];
  let dat = true;
  for (const buoc of BUOC) {
    const batDau = Date.now();
    const kq = spawnSync(buoc.lenh, { cwd, shell: true, encoding: "utf8" });
    const giay = ((Date.now() - batDau) / 1000).toFixed(1);
    if (kq.status === 0) {
      dong.push(`✓ ${buoc.ten} (${giay}s)`);
      continue;
    }
    dat = false;
    dong.push(`✗ ${buoc.ten} (${giay}s)\n${duoi(kq.stdout + kq.stderr)}`);
    if (!het) break;
  }
  return { dat, dong };
}

if (process.argv[1]?.endsWith("kiem.ts")) {
  const { dat, dong } = chayKiem(process.argv.includes("--het"));
  for (const d of dong) console.log(d);
  console.log(dat ? "\nXanh: có thể commit." : "\nĐỏ: sửa rồi chạy lại.");
  process.exitCode = dat ? 0 : 1;
}
