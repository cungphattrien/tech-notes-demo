// Dựng một kho Git tạm có cài hook, rồi thử commit bốn lần để thấy hook chặn gì và bỏ qua gì.
// Chạy: node thu-hook.ts
import { spawnSync } from "node:child_process";
import { appendFileSync, cpSync, mkdtempSync, symlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const GOC = process.cwd();
const kho = mkdtempSync(join(tmpdir(), "hook-"));
cpSync(GOC, kho, { recursive: true, filter: (n) => !/(^|[\\/])(node_modules|\.git)$/.test(n) });
symlinkSync(join(GOC, "node_modules"), join(kho, "node_modules"), "junction"); // dùng chung thư viện, khỏi cài lại

const git = (...args: string[]) => spawnSync("git", args, { cwd: kho, encoding: "utf8" });
git("init", "-q", "-b", "main");
git("config", "user.name", "Demo");
git("config", "user.email", "demo@example.com");
git("add", "-A");
git("commit", "-q", "-m", "chore: khởi tạo");
git("config", "core.hooksPath", "hooks"); // từ đây Git chạy file trong hooks/ thay vì .git/hooks/

function thu(nhan: string, tinNhan: string, ...them: string[]) {
  git("add", "-A");
  const kq = git("commit", "-m", tinNhan, ...them);
  const ra = (kq.stdout + kq.stderr).trim().split(/\r?\n/).filter((d) => !/^\[main|^ \d+ file|create mode|^ \d+ files/.test(d));
  console.log(`\n${nhan}\n$ git commit -m "${tinNhan}"${them.length ? " " + them.join(" ") : ""}\n  → ${kq.status === 0 ? "COMMIT ĐƯỢC TẠO" : "COMMIT BỊ CHẶN"}`);
  for (const d of ra) console.log("    " + d);
}

const FILE = join(kho, "src", "phan-loai.ts");
appendFileSync(FILE, "\nenum Loai { An, Uong }\n");
thu("1. Code hỏng (có enum), tin nhắn tốt", "fix(bot): thêm kiểu Loai");
git("checkout", "HEAD", "--", "src/phan-loai.ts"); // bỏ enum, trả file về như lúc commit đầu
appendFileSync(FILE, "\n// thêm một dòng chú thích\n");
thu("2. Code ổn, tin nhắn mơ hồ", "fix");
thu("3. Code ổn, tin nhắn đúng dạng", "docs(bot): thêm chú thích");
appendFileSync(FILE, "\nenum Loai { An, Uong }\n");
thu("4. Code hỏng nhưng bỏ qua hook", "feat(bot): kiểu Loai", "--no-verify");
